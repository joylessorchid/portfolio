export const langs = ['ru', 'en'] as const;
export type Lang = (typeof langs)[number];

/** Текст на двух языках. Все пользовательские строки контента хранятся так. */
export type L10n<T = string> = Record<Lang, T>;

export const htmlLang: Record<Lang, string> = { ru: 'ru', en: 'en' };
export const ogLocale: Record<Lang, string> = { ru: 'ru_RU', en: 'en_US' };

/** Путь страницы в нужной локали: RU живёт в корне, EN — под /en/. */
export function localePath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const withSlash = clean.endsWith('/') || clean.includes('.') ? clean : `${clean}/`;
  return lang === 'ru' ? withSlash : `/en${withSlash === '/' ? '/' : withSlash}`;
}

export const cvFile: Record<Lang, string> = {
  ru: '/cv/Nikolay-Skorikov-CV-ru.pdf',
  en: '/cv/Nikolay-Skorikov-CV-en.pdf',
};

export const ui = {
  ru: {
    skip: 'Перейти к содержанию',
    nav: { projects: 'Проекты', services: 'Услуги', experience: 'Опыт', stack: 'Стек', contact: 'Контакты' },
    menu: 'Меню',
    close: 'Закрыть',
    langSwitch: 'English version',
    cv: 'Резюме, PDF',
    telegram: 'Telegram',
    email: 'Email',
    projectsAnchor: 'Проекты',
    sections: {
      projects: { eyebrow: 'Проекты', title: 'Проекты', meta: '07 работ · 2024 — 2026' },
      services: { eyebrow: 'Услуги', title: 'Услуги', lead: 'Полный цикл: архитектура и интеграции, деплой, мониторинг и поддержка.' },
      experience: {
        eyebrow: 'Опыт',
        title: 'Опыт',
        lead: 'Более трёх лет эксплуатации production-систем: МПГУ, e-commerce-стартап, собственные продукты. С 2026 года — магистратура НИУ ВШЭ «ЛигалТех».',
      },
      education: { eyebrow: 'Образование', title: 'Образование' },
      stack: { eyebrow: 'Стек', title: 'Стек' },
      contact: {
        eyebrow: 'Контакты',
        title: 'Проекты, сотрудничество, вакансии',
        lead: 'Самый быстрый канал — Telegram. Резюме в PDF доступно на русском и английском.',
      },
    },
    examples: 'Примеры',
    details: 'Открыть кейс',
    visit: 'Открыть сайт',
    now: 'Сейчас',
    status: { prod: 'В проде', beta: 'Бета', personal: 'Личный проект', done: 'Завершён' },
    project: {
      back: 'Все проекты',
      label: 'Кейс',
      role: 'Роль',
      period: 'Период',
      stack: 'Стек',
      link: 'Ссылка',
      screens: 'Экраны',
      next: 'Следующий кейс',
      openImage: 'Открыть в полном размере',
      of: 'из',
    },
    copy: 'Скопировать email',
    copied: 'Скопировано',
    footer: { rights: 'Николай Скориков', place: 'Москва · v2horizon.com' },
    notFound: { title: 'Страница не найдена', text: 'Такой страницы нет — возможно, ссылка устарела.', home: 'На главную' },
    cvPage: { title: 'Резюме', download: 'Скачать PDF', back: 'На сайт' },
  },
  en: {
    skip: 'Skip to content',
    nav: { projects: 'Work', services: 'Services', experience: 'Experience', stack: 'Stack', contact: 'Contact' },
    menu: 'Menu',
    close: 'Close',
    langSwitch: 'Русская версия',
    cv: 'CV, PDF',
    telegram: 'Telegram',
    email: 'Email',
    projectsAnchor: 'Work',
    sections: {
      projects: { eyebrow: 'Work', title: 'Work', meta: '07 projects · 2024 — 2026' },
      services: { eyebrow: 'Services', title: 'Services', lead: 'Full cycle: architecture and integrations, deployment, monitoring and support.' },
      experience: {
        eyebrow: 'Experience',
        title: 'Experience',
        lead: 'Over three years operating production systems: MPGU, an e-commerce startup, own products. From 2026 — master’s in LegalTech at HSE University.',
      },
      education: { eyebrow: 'Education', title: 'Education' },
      stack: { eyebrow: 'Stack', title: 'Stack' },
      contact: {
        eyebrow: 'Contact',
        title: 'Projects, collaboration, roles',
        lead: 'Telegram is the fastest channel. The CV is available as a PDF in Russian and English.',
      },
    },
    examples: 'Examples',
    details: 'Open case study',
    visit: 'Visit site',
    now: 'Now',
    status: { prod: 'Live', beta: 'Beta', personal: 'Personal project', done: 'Completed' },
    project: {
      back: 'All work',
      label: 'Case',
      role: 'Role',
      period: 'Period',
      stack: 'Stack',
      link: 'Link',
      screens: 'Screens',
      next: 'Next case',
      openImage: 'Open full size',
      of: 'of',
    },
    copy: 'Copy email',
    copied: 'Copied',
    footer: { rights: 'Nikolay Skorikov', place: 'Moscow · v2horizon.com' },
    notFound: { title: 'Page not found', text: 'This page doesn’t exist — the link may be outdated.', home: 'Back home' },
    cvPage: { title: 'CV', download: 'Download PDF', back: 'Back to site' },
  },
} as const;

export function useUi(lang: Lang) {
  return ui[lang];
}
