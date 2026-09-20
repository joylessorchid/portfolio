// Full static QA of the production build: every page from the sitemap (+404) at 7 widths.
// Layout (text spill / clipping / truncation / overlaps / off-screen), images, headings,
// meta/SEO, links, console, plus axe-core on a subset. Motion is disabled (reducedMotion)
// so the layout is measured in its final state.
// usage (from the project dir): node _qa.mjs <outDir> <axePath>
import { preview } from 'astro';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2];
const AXE = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4390;
const server = await preview({ root: '.', logLevel: 'error', server: { host: '127.0.0.1', port: PORT } });
const B = `http://127.0.0.1:${PORT}`;

const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
const pages = [...sitemap.matchAll(/<loc>https:\/\/v2horizon\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
pages.push('/this-page-does-not-exist/');
const WIDTHS = [320, 390, 768, 1024, 1280, 1440, 1920];
const AXE_PAGES = ['/', '/en/', '/projects/voicemanager/', '/projects/mpgu-bot/', '/projects/diagnostic-assistant/', '/cv/', '/this-page-does-not-exist/'];
const SHOT_WIDTHS = [390, 1440];

const browser = await chromium.launch({ channel: 'msedge' });
const findings = []; // {page, width, kind, detail}
const add = (page, width, kind, detail) => findings.push({ page, width, kind, detail });
const meta = {};
const links = new Map(); // href -> Set(pages)
const axeResults = [];
const shots = {}; // page -> {width: buffer}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.images]
        .filter((i) => !i.complete)
        .map((i) => new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); setTimeout(r, 4000); })),
    );
  });
  await page.waitForTimeout(150);
}

function audit() {
  const vw = innerWidth;
  const res = { overflowX: document.documentElement.scrollWidth - vw, spill: [], clipped: [], truncated: [], offscreen: [], overlapTT: [], overlapTI: [], imgs: [], headings: [], fonts: {} };
  const cssOf = (e) => getComputedStyle(e);
  const visible = (el) => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = cssOf(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0 || e.hasAttribute('hidden')) return false;
    }
    return true;
  };
  const excluded = (el) => el.closest('.marquee, .visually-hidden, .skip-link, dialog:not([open]), [hidden], script, style, noscript, title');
  const name = (el) => {
    const cls = [...el.classList].filter((c) => !c.startsWith('astro-')).slice(0, 2).join('.');
    const par = el.parentElement ? [...el.parentElement.classList].filter((c) => !c.startsWith('astro-'))[0] || el.parentElement.tagName.toLowerCase() : '';
    return `${par} > ${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`;
  };
  const clipAncestors = (el) => {
    const out = [];
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const cs = cssOf(e);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') out.push(e);
    }
    return out;
  };
  const blockOf = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const d = cssOf(e).display;
      if (!d.startsWith('inline') && d !== 'contents') return e;
    }
    return document.body;
  };
  const contentBox = (e) => {
    const r = e.getBoundingClientRect();
    const cs = cssOf(e);
    return { left: r.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), right: r.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth), top: r.top, bottom: r.bottom };
  };
  const inter = (a, b) => ({ w: Math.min(a.right, b.right) - Math.max(a.left, b.left), h: Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) });

  // text leaves
  const leaves = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode()) {
    const t = tw.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || excluded(el) || !visible(el)) continue;
    const range = document.createRange();
    range.selectNodeContents(t);
    const rects = [...range.getClientRects()].filter((q) => q.width > 0.5 && q.height > 0.5);
    if (!rects.length) continue;
    leaves.push({ el, rects, text: t.textContent.replace(/\s+/g, ' ').trim().slice(0, 48) });
  }

  for (const lf of leaves) {
    const box = lf.rects.reduce((a, q) => ({ left: Math.min(a.left, q.left), top: Math.min(a.top, q.top), right: Math.max(a.right, q.right), bottom: Math.max(a.bottom, q.bottom) }), { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 });
    lf.box = box;
    const clippers = clipAncestors(lf.el);
    const ellipsisHost = [lf.el, ...clippers].find((e) => cssOf(e).textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1);
    if (ellipsisHost) { res.truncated.push(`${name(ellipsisHost)} "${lf.text}"`); continue; }
    // clipped by an overflow ancestor
    let clippedBy = null;
    for (const c of clippers) {
      const r = c.getBoundingClientRect();
      const st = cssOf(c);
      const outX = box.left < r.left - 1 || box.right > r.right + 1;
      const outY = box.top < r.top - 1 || box.bottom > r.bottom + 1;
      // карусель: кадры за краем прокручиваемой ленты — это нормально, считаем только другую ось
      const scrollsX = st.overflowX === 'auto' || st.overflowX === 'scroll';
      const scrollsY = st.overflowY === 'auto' || st.overflowY === 'scroll';
      if ((outX && !scrollsX) || (outY && !scrollsY)) { clippedBy = c; break; }
    }
    if (clippedBy) { res.clipped.push(`${name(lf.el)} "${lf.text}" clipped by ${name(clippedBy)}`); continue; }
    // spills out of its block box horizontally
    const blk = blockOf(lf.el);
    const cb = contentBox(blk);
    if (box.right > cb.right + 2 || box.left < cb.left - 2) res.spill.push(`${name(lf.el)} "${lf.text}" by ${Math.round(Math.max(box.right - cb.right, cb.left - box.left))}px`);
    if (box.right > vw + 1 || box.left < -1) res.offscreen.push(`${name(lf.el)} "${lf.text}" right=${Math.round(box.right)} vw=${vw}`);
  }

  // text vs text overlaps (different elements, neither contains the other)
  for (let i = 0; i < leaves.length; i++) {
    for (let j = i + 1; j < leaves.length; j++) {
      const a = leaves[i], b = leaves[j];
      if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      if (a.box.bottom < b.box.top || b.box.bottom < a.box.top || a.box.right < b.box.left || b.box.right < a.box.left) continue;
      let hit = null;
      for (const ra of a.rects) for (const rb of b.rects) { const q = inter(ra, rb); if (q.w > 2 && q.h > 3) hit = q; }
      if (hit) res.overlapTT.push(`"${a.text}" (${name(a.el)}) × "${b.text}" (${name(b.el)}) ${Math.round(hit.w)}x${Math.round(hit.h)}`);
    }
  }

  // images
  const imgs = [...document.images].filter((im) => !excluded(im) && visible(im));
  for (const im of imgs) {
    const r = im.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (!im.complete || im.naturalWidth === 0) res.imgs.push(`BROKEN ${im.currentSrc || im.src}`);
    if (!im.hasAttribute('alt')) res.imgs.push(`NO-ALT ${im.currentSrc || im.src}`);
    // blurry: the chosen source is smaller than the rendered size (DPR 1 in this run)
    if (im.naturalWidth && r.width > im.naturalWidth * 1.08 && getComputedStyle(im).objectFit !== 'cover') res.imgs.push(`UPSCALED ${Math.round(r.width)}px from ${im.naturalWidth}px ${(im.currentSrc || '').split('/').pop()}`);
    // text over image
    for (const lf of leaves) {
      if (im.contains(lf.el) || lf.el.contains(im)) continue;
      const q = inter(r, lf.box);
      if (q.w > 2 && q.h > 3) {
        // only count if the text is actually painted over the visible part of the image
        const clippers = clipAncestors(im);
        let vis = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        for (const c of clippers) { const cr = c.getBoundingClientRect(); vis = { left: Math.max(vis.left, cr.left), right: Math.min(vis.right, cr.right), top: Math.max(vis.top, cr.top), bottom: Math.min(vis.bottom, cr.bottom) }; }
        const q2 = inter(vis, lf.box);
        if (q2.w > 2 && q2.h > 3) res.overlapTI.push(`"${lf.text}" (${name(lf.el)}) over img ${(im.currentSrc || im.src).split('/').pop().slice(0, 40)}`);
      }
    }
    // image visibly beyond the viewport
    let vis = { left: r.left, right: r.right };
    for (const c of clipAncestors(im)) { const cr = c.getBoundingClientRect(); vis = { left: Math.max(vis.left, cr.left), right: Math.min(vis.right, cr.right) }; }
    if (vis.right > vw + 1 || vis.left < -1) res.offscreen.push(`img ${(im.currentSrc || im.src).split('/').pop().slice(0, 40)} visible right=${Math.round(vis.right)}`);
  }

  // headings outline
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => visible(h) && !excluded(h));
  let prev = 0;
  const h1s = hs.filter((h) => h.tagName === 'H1').length;
  if (h1s !== 1) res.headings.push(`h1 count = ${h1s}`);
  for (const h of hs) {
    const lvl = +h.tagName[1];
    if (prev && lvl > prev + 1) res.headings.push(`skip h${prev} → h${lvl} "${h.textContent.trim().slice(0, 40)}"`);
    prev = lvl;
  }
  res.fonts = Object.fromEntries(['Prata', 'Manrope', 'JetBrains Mono'].map((f) => [f, document.fonts.check(`16px "${f}"`)]));
  return res;
}

function metaAudit() {
  const q = (s, a) => document.querySelector(s)?.getAttribute(a) ?? null;
  const alts = Object.fromEntries([...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [l.hreflang, l.getAttribute('href')]));
  let jsonld = null;
  const ld = document.querySelector('script[type="application/ld+json"]');
  if (ld) { try { JSON.parse(ld.textContent); jsonld = 'ok'; } catch (e) { jsonld = 'INVALID ' + e.message; } }
  return {
    lang: document.documentElement.lang,
    title: document.title,
    description: q('meta[name="description"]', 'content'),
    canonical: q('link[rel="canonical"]', 'href'),
    alternates: alts,
    ogImage: q('meta[property="og:image"]', 'content'),
    robots: q('meta[name="robots"]', 'content'),
    langSwitch: q('a.lang', 'href'),
    jsonld,
    links: [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.href))],
  };
}

const consoleProblems = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : w >= 1920 ? 1080 : 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  let current = '';
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && consoleProblems.push(`${current} @${w}: [${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => consoleProblems.push(`${current} @${w}: [pageerror] ${e}`));
  page.on('response', (r) => { if (r.status() >= 400 && !(current.includes('does-not-exist') && r.url().includes('does-not-exist'))) consoleProblems.push(`${current} @${w}: HTTP ${r.status()} ${r.url()}`); });
  for (const p of pages) {
    current = p;
    await page.goto(B + p, { waitUntil: 'networkidle' });
    await settle(page);
    const r = await page.evaluate(audit);
    if (r.overflowX > 0) add(p, w, 'overflowX', `${r.overflowX}px`);
    for (const k of ['spill', 'clipped', 'truncated', 'offscreen', 'overlapTT', 'overlapTI', 'imgs', 'headings']) for (const d of r[k]) add(p, w, k, d);
    const missingFonts = Object.entries(r.fonts).filter(([, v]) => !v).map(([f]) => f);
    if (missingFonts.length) add(p, w, 'fonts', missingFonts.join(', '));
    if (w === 1440) {
      const m = await page.evaluate(metaAudit);
      meta[p] = m;
      for (const l of m.links) { if (!links.has(l)) links.set(l, new Set()); links.get(l).add(p); }
    }
    if (SHOT_WIDTHS.includes(w)) {
      (shots[p] ??= {})[w] = await page.screenshot({ fullPage: true });
    }
    if ((w === 1440 || w === 390) && AXE_PAGES.includes(p)) {
      await page.addScriptTag({ path: AXE });
      const ax = await page.evaluate(async () => {
        const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
        return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map((n) => ({ target: n.target.join(' '), html: n.html.slice(0, 140), summary: (n.failureSummary || '').split('\n').slice(1, 3).join(' ').slice(0, 220) })) }));
      });
      for (const v of ax) axeResults.push({ page: p, width: w, ...v });
    }
  }
  await ctx.close();
  console.log(`width ${w}: done`);
}

// ---------- internal links & anchors ----------
const linkIssues = [];
const external = new Map();
for (const [href, from] of links) {
  const u = new URL(href);
  if (u.origin !== B) { external.set(href, [...from]); continue; }
  const res = await fetch(u.origin + u.pathname, { redirect: 'manual' });
  const okStatus = res.status === 200 || (res.status === 301 && u.pathname === '/resume.pdf');
  if (!okStatus) linkIssues.push(`${res.status} ${u.pathname} (from ${[...from].slice(0, 3).join(', ')})`);
  if (u.hash && res.status === 200 && (res.headers.get('content-type') || '').includes('html')) {
    const html = await res.text();
    const id = decodeURIComponent(u.hash.slice(1));
    if (!new RegExp(`id="${id}"`).test(html)) linkIssues.push(`missing anchor ${u.pathname}${u.hash} (from ${[...from].slice(0, 3).join(', ')})`);
  }
}

// ---------- meta checks ----------
const metaIssues = [];
const titles = new Map();
for (const [p, m] of Object.entries(meta)) {
  const is404 = p.includes('does-not-exist');
  if (!m.title) metaIssues.push(`${p}: empty title`);
  titles.set(m.title, [...(titles.get(m.title) || []), p]);
  if (!is404 && !m.description) metaIssues.push(`${p}: no description`);
  if (!is404) {
    const expCanon = `https://v2horizon.com${p}`;
    if (m.canonical !== expCanon) metaIssues.push(`${p}: canonical ${m.canonical} ≠ ${expCanon}`);
    const ruPath = p.startsWith('/en/') ? p.slice(3) : p;
    const enPath = p.startsWith('/en/') ? p : `/en${p}`;
    if (m.alternates.ru !== `https://v2horizon.com${ruPath}` || m.alternates.en !== `https://v2horizon.com${enPath}` || m.alternates['x-default'] !== `https://v2horizon.com${ruPath}`) metaIssues.push(`${p}: hreflang ${JSON.stringify(m.alternates)}`);
    const expSwitch = p.startsWith('/en/') ? ruPath : enPath;
    if (m.langSwitch && m.langSwitch !== expSwitch) metaIssues.push(`${p}: lang switch → ${m.langSwitch}, expected ${expSwitch}`);
    const expLang = p.startsWith('/en/') ? 'en' : 'ru';
    if (m.lang !== expLang) metaIssues.push(`${p}: html lang=${m.lang}`);
  } else {
    if (m.langSwitch) metaIssues.push(`404: lang switch → ${m.langSwitch}`);
  }
  if (m.ogImage) {
    const og = new URL(m.ogImage);
    const r = await fetch(B + og.pathname);
    if (r.status !== 200) metaIssues.push(`${p}: og:image ${og.pathname} → ${r.status}`);
  } else if (!is404) metaIssues.push(`${p}: no og:image`);
  if (m.jsonld && m.jsonld !== 'ok') metaIssues.push(`${p}: JSON-LD ${m.jsonld}`);
}
for (const [t, ps] of titles) if (ps.length > 1) metaIssues.push(`duplicate title "${t}" on ${ps.join(', ')}`);

// ---------- screenshots → contact sheets ----------
for (const w of SHOT_WIDTHS) {
  const tiles = [];
  const thumbW = w < 600 ? 195 : 360;
  for (const p of pages) {
    const buf = shots[p]?.[w];
    if (!buf) continue;
    const t = await sharp(buf).resize({ width: thumbW }).png().toBuffer();
    const m = await sharp(t).metadata();
    const label = Buffer.from(`<svg width="${thumbW}" height="22"><rect width="100%" height="100%" fill="#222"/><text x="6" y="15" font-family="Arial" font-size="12" fill="#fff">${p.replace(/&/g, '&amp;')}</text></svg>`);
    tiles.push({ t, label, h: m.height });
  }
  const perSheet = w < 600 ? 11 : 6;
  for (let s = 0; s * perSheet < tiles.length; s++) {
    const group = tiles.slice(s * perSheet, (s + 1) * perSheet);
    const H = Math.max(...group.map((g) => g.h)) + 22;
    const comps = [];
    group.forEach((g, i) => { comps.push({ input: g.label, left: i * (thumbW + 8), top: 0 }); comps.push({ input: g.t, left: i * (thumbW + 8), top: 22 }); });
    await sharp({ create: { width: group.length * (thumbW + 8), height: Math.min(H, 16000), channels: 3, background: '#777' } }).composite(comps).jpeg({ quality: 78 }).toFile(path.join(OUT, `sheet-${w}-${s + 1}.jpg`));
  }
  for (const p of ['/', '/en/', '/projects/voicemanager/', '/cv/']) {
    const buf = shots[p]?.[w];
    if (!buf) continue;
    const m = await sharp(buf).metadata();
    const chunk = w < 600 ? 2400 : 1600;
    for (let i = 0; i * chunk < m.height; i++) {
      const h = Math.min(chunk, m.height - i * chunk);
      await sharp(buf).extract({ left: 0, top: i * chunk, width: m.width, height: h }).resize({ width: Math.min(900, m.width) }).jpeg({ quality: 80 }).toFile(path.join(OUT, `page${p.replace(/\//g, '_')}${w}-${i + 1}.jpg`));
    }
  }
}

await browser.close();
await server.stop();

// ---------- report ----------
const byKind = {};
for (const f of findings) (byKind[f.kind] ??= []).push(f);
const lines = [];
lines.push(`pages: ${pages.length}, widths: ${WIDTHS.join(', ')}`);
for (const [k, list] of Object.entries(byKind)) {
  lines.push(`\n== ${k}: ${list.length}`);
  const grouped = new Map();
  for (const f of list) { const key = f.detail; if (!grouped.has(key)) grouped.set(key, []); grouped.get(key).push(`${f.page}@${f.width}`); }
  for (const [d, where] of [...grouped].slice(0, 60)) lines.push(`  ${d}\n      at ${where.slice(0, 8).join(', ')}${where.length > 8 ? ` (+${where.length - 8})` : ''}`);
}
lines.push(`\n== console/network: ${consoleProblems.length}`);
for (const c of [...new Set(consoleProblems)].slice(0, 40)) lines.push('  ' + c);
lines.push(`\n== internal links: ${links.size - external.size} checked, issues: ${linkIssues.length}`);
for (const l of linkIssues) lines.push('  ' + l);
lines.push(`\n== external links (${external.size}):`);
for (const [h, from] of external) lines.push(`  ${h}   ← ${from.length} page(s)`);
lines.push(`\n== meta issues: ${metaIssues.length}`);
for (const m of metaIssues) lines.push('  ' + m);
lines.push(`\n== axe violations: ${axeResults.length}`);
const axeBy = new Map();
for (const a of axeResults) { const k = `${a.id} [${a.impact}] ${a.help}`; if (!axeBy.has(k)) axeBy.set(k, []); axeBy.get(k).push(a); }
for (const [k, list] of axeBy) {
  lines.push(`  ${k}  — on ${list.map((a) => `${a.page}@${a.width}(${a.nodes.length})`).join(', ')}`);
  for (const n of list[0].nodes.slice(0, 6)) lines.push(`      ${n.target}  |  ${n.summary}`);
}
fs.writeFileSync(path.join(OUT, 'report.txt'), lines.join('\n'));
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ findings, consoleProblems, linkIssues, external: [...external], metaIssues, axeResults, meta }, null, 2));
console.log(lines.join('\n'));
