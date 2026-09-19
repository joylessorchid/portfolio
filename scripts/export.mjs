// Собирает сайт и генерирует из него статические файлы, которые лежат в public/:
//   public/cv/Nikolay-Skorikov-CV-{ru,en}.pdf  — резюме из страниц /cv/ и /en/cv/
//   public/og/og-{ru,en}.png                    — превью для соцсетей из /og/{ru,en}/
//   public/apple-touch-icon.png                  — иконка для iOS из favicon.svg
//
// Запуск: npm run export — после правок в src/data/*, затем закоммитить public/.
// Нужен установленный Microsoft Edge или Google Chrome (браузер не скачивается).
import { build, preview } from 'astro';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = (...p) => path.join(root, 'public', ...p);
const PORT = 4399;

async function launchBrowser() {
  for (const channel of ['msedge', 'chrome']) {
    try {
      return await chromium.launch({ channel });
    } catch {
      /* пробуем следующий */
    }
  }
  throw new Error('Не найден Microsoft Edge или Google Chrome — они нужны для печати PDF.');
}

await build({ root, logLevel: 'warn' });
const server = await preview({ root, logLevel: 'warn', server: { host: '127.0.0.1', port: PORT } });
const base = `http://127.0.0.1:${PORT}`;
const browser = await launchBrowser();

try {
  await fs.mkdir(pub('cv'), { recursive: true });
  await fs.mkdir(pub('og'), { recursive: true });
  const ctx = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' });
  const page = await ctx.newPage();

  for (const lang of ['ru', 'en']) {
    const prefix = lang === 'ru' ? '' : '/en';

    await page.setViewportSize({ width: 1100, height: 1400 });
    await page.goto(`${base}${prefix}/cv/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    const pdf = pub('cv', `Nikolay-Skorikov-CV-${lang}.pdf`);
    await page.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: 'screen' });

    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto(`${base}/og/${lang}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: pub('og', `og-${lang}.png`), clip: { x: 0, y: 0, width: 1200, height: 630 } });

    const { size } = await fs.stat(pdf);
    console.log(`✓ ${lang}: ${path.basename(pdf)} (${Math.round(size / 1024)} KB), og-${lang}.png`);
  }

  // iOS сама скругляет углы — отдаём квадрат без скругления; 32px — для браузеров без SVG-иконок
  const svg = await fs.readFile(pub('favicon.svg'), 'utf8');
  await sharp(Buffer.from(svg.replace(/rx="\d+"/, 'rx="0"')), { density: 1200 }).resize(180, 180).png().toFile(pub('apple-touch-icon.png'));
  await sharp(Buffer.from(svg), { density: 1200 }).resize(32, 32).png().toFile(pub('favicon-32.png'));
  console.log('✓ apple-touch-icon.png, favicon-32.png');
} finally {
  await browser.close();
  await server.stop();
}
