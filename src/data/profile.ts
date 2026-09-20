import type { L10n } from '../i18n/ui';

export const profile = {
  name: { ru: 'Николай Скориков', en: 'Nikolay Skorikov' } satisfies L10n,
  firstName: { ru: 'Николай', en: 'Nikolay' } satisfies L10n,
  lastName: { ru: 'Скориков', en: 'Skorikov' } satisfies L10n,
  role: {
    ru: 'Инженер AI-продуктов и инфраструктуры',
    en: 'AI Product & Infrastructure Engineer',
  } satisfies L10n,
  /** Короткая форма для заголовка вкладки. */
  roleShort: { ru: 'AI-продукты и инфраструктура', en: 'AI products & infrastructure' } satisfies L10n,
  availability: {
    ru: 'Открыт к новым проектам и сотрудничеству',
    en: 'Open to new projects and collaboration',
  } satisfies L10n,
  lead: {
    ru: 'Проектирование, разработка и эксплуатация AI-сервисов: голосовые агенты, интернет-магазины, Telegram-боты и автоматизации на n8n — от инфраструктуры до интерфейса.',
    en: 'Design, development and operation of AI services: voice agents, online stores, Telegram bots and n8n automations — from infrastructure to interface.',
  } satisfies L10n,
  location: {
    ru: 'Москва · удалённо, гибрид или офис',
    en: 'Moscow · remote, hybrid or on-site',
  } satisfies L10n,
  locationShort: { ru: 'Москва / удалённо', en: 'Moscow / remote' } satisfies L10n,
  portraitCaption: {
    ru: ['Портрет · 2026', 'Удалённо · гибрид · офис'],
    en: ['Portrait · 2026', 'Remote · hybrid · on-site'],
  } satisfies L10n<string[]>,
  metaDescription: {
    ru: 'Николай Скориков — инженер AI-продуктов и инфраструктуры: голосовые AI-агенты, интернет-магазины, Telegram-боты, автоматизации на n8n, DevOps. Открыт к проектам и сотрудничеству.',
    en: 'Nikolay Skorikov — AI product & infrastructure engineer: voice AI agents, online stores, Telegram bots, n8n automations and DevOps. Open to projects and collaboration.',
  } satisfies L10n,

  stats: [
    { value: { ru: '4 700+', en: '4,700+' }, label: { ru: 'пользователей у Telegram-бота', en: 'Telegram bot users' } },
    { value: { ru: '40', en: '40' }, label: { ru: 'операторов на телефонии, поднятой с нуля', en: 'call-center agents on telephony built from scratch' } },
    { value: { ru: '3+', en: '3+' }, label: { ru: 'года в продакшене: деплой, мониторинг, инциденты', en: 'years in production: deploys, monitoring, incidents' } },
  ] satisfies { value: L10n; label: L10n }[],

  marquee: {
    ru: ['VoiceManager — голосовой AI-агент', 'GadgetPick — магазин с нуля', 'Бот с расписанием — 4 700+ студентов', 'n8n-пайплайны', 'Homelab на Proxmox', 'Asterisk на 40 операторов'],
    en: ['VoiceManager — voice AI agent', 'GadgetPick — a store from scratch', 'Schedule bot — 4,700+ students', 'n8n pipelines', 'Proxmox homelab', 'Asterisk for 40 agents'],
  } satisfies L10n<string[]>,

  now: {
    ru: ['Магистратура НИУ ВШЭ «ЛигалТех»', 'Фриланс-проекты', 'Развитие VoiceManager'],
    en: ['Master’s in LegalTech at HSE University', 'Freelance projects', 'Building VoiceManager'],
  } satisfies L10n<string[]>,

  contacts: {
    email: 'nikolai-skorikov@outlook.com',
    telegram: { handle: '@joylessorchid', url: 'https://t.me/joylessorchid' },
    linkedin: { handle: '/in/nikolay-skorikov', url: 'https://www.linkedin.com/in/nikolay-skorikov-023267400' },
    github: { handle: '/joylessorchid', url: 'https://github.com/joylessorchid' },
    site: 'v2horizon.com',
  },

  languages: {
    ru: ['Русский — родной', 'Английский — B1: документация и переписка'],
    en: ['Russian — native', 'English — B1 (intermediate): docs and written communication'],
  } satisfies L10n<string[]>,
};
