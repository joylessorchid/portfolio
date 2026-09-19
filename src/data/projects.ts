import type { ImageMetadata } from 'astro';
import type { L10n } from '../i18n/ui';

import vmDashboard from '../assets/projects/voicemanager/dashboard.webp';
import vmCall from '../assets/projects/voicemanager/call.webp';
import vmDashboardLight from '../assets/projects/voicemanager/dashboard-light.webp';
import vmSecurity from '../assets/projects/voicemanager/security.webp';
import vmLogin from '../assets/projects/voicemanager/login.png';
import gpStorefront from '../assets/projects/gadgetpick/storefront.webp';
import gpCatalog from '../assets/projects/gadgetpick/catalog.webp';
import gpAdmin from '../assets/projects/gadgetpick/admin.webp';
import botSchedule from '../assets/projects/mpgu-bot/schedule.png';
import botEvening from '../assets/projects/mpgu-bot/schedule-evening.png';
import botCalendar from '../assets/projects/mpgu-bot/calendar.png';
import botGroups from '../assets/projects/mpgu-bot/groups.png';
import botSettings from '../assets/projects/mpgu-bot/settings.png';
import n8nMax from '../assets/projects/automations/n8n-max-telegram.png';
import n8nYoutube from '../assets/projects/automations/n8n-youtube.png';
import labProxmox from '../assets/projects/homelab/proxmox.png';
import labGrafana from '../assets/projects/homelab/grafana.png';
import labTechnitium from '../assets/projects/homelab/technitium.png';
import ccLanding from '../assets/projects/callcenter/landing.png';
import ccCrm from '../assets/projects/callcenter/crm-leadvertex.png';

export type Status = 'prod' | 'beta' | 'personal' | 'done';
export type Tint = 'violet' | 'sand' | 'blue' | 'teal' | 'coral' | 'slate' | 'amber';
export type Diagram = 'voice' | 'diagnostic' | 'homelab';

export interface Shot {
  src: ImageMetadata;
  alt: L10n;
  device: 'desktop' | 'phone';
  /** Тема самого скриншота — под неё красится рамка браузера. */
  theme: 'dark' | 'light';
  /** Адрес в декоративной строке браузера. */
  url?: string;
}

export interface CaseSection {
  title: L10n;
  text?: L10n;
  list?: L10n<string[]>;
  diagram?: Diagram;
}

/** Сцена проекта: что показывается в витрине на главной и в шапке кейса. */
export type Cover =
  | { kind: 'frame'; shot: Shot }
  | { kind: 'phones'; shots: [Shot, Shot, Shot] }
  | { kind: 'diagram'; diagram: Diagram }
  | { kind: 'numbers'; items: { value: string; label: L10n }[] };

export interface Project {
  slug: string;
  featured: boolean;
  status: Status;
  tint: Tint;
  title: L10n;
  tagline: L10n;
  /** Короткая подпись для списка проектов. */
  tag: L10n;
  summary: L10n;
  highlights: L10n<string[]>;
  role: L10n;
  period: L10n;
  stack: string[];
  link?: { href: string; label: string };
  note?: L10n;
  cover: Cover;
  gallery: Shot[];
  sections: CaseSection[];
  /** Одна строка для PDF-резюме. */
  cv: L10n;
}

// Важно: не читать поля ImageMetadata (width, height…) в своём коде — Astro тогда
// считает оригинал использованным и кладёт несжатый файл в dist. Поэтому device задаётся явно.
const shot = (
  src: ImageMetadata,
  ru: string,
  en: string,
  theme: Shot['theme'],
  opts: { url?: string; device?: Shot['device'] } = {},
): Shot => ({
  src,
  alt: { ru, en },
  device: opts.device ?? 'desktop',
  theme,
  url: opts.url,
});

const s = {
  vmDashboard: shot(vmDashboard, 'VoiceManager: дашборд кабинета — дозвон, заказы, воронка и ритм обзвона', 'VoiceManager dashboard: pick-up rate, orders, call funnel and activity', 'dark', { url: 'ai.v2horizon.com/dashboard' }),
  vmCall: shot(vmCall, 'Карточка звонка: транскрипт разговора агента с клиентом и данные, собранные для CRM', 'Call details: the agent–customer transcript and data extracted for the CRM', 'dark', { url: 'ai.v2horizon.com/calls' }),
  vmDashboardLight: shot(vmDashboardLight, 'Дашборд в светлой теме и AI-ассистент, который управляет кабинетом', 'Dashboard in the light theme with the AI assistant that runs the account', 'light', { url: 'ai.v2horizon.com/dashboard' }),
  vmSecurity: shot(vmSecurity, 'Безопасность: двухфакторный вход, API-ключи для интеграций и активные сеансы', 'Security: two-factor sign-in, integration API keys and active sessions', 'dark', { url: 'ai.v2horizon.com/security' }),
  vmLogin: shot(vmLogin, 'Экран входа в кабинет клиента VoiceManager', 'VoiceManager client sign-in screen', 'dark', { url: 'ai.v2horizon.com' }),
  gpStorefront: shot(gpStorefront, 'GadgetPick: главная страница магазина — «Вещи с характером для дома, сада и дороги»', 'GadgetPick storefront home page', 'light', { url: 'gadgetpick.ru' }),
  gpCatalog: shot(gpCatalog, 'Каталог GadgetPick с фильтрами по цене, бренду и меткам', 'GadgetPick catalog with price, brand and tag filters', 'light', { url: 'gadgetpick.ru/shop' }),
  gpAdmin: shot(gpAdmin, 'Админ-панель GadgetPick: товары с артикулом, ценой, маржой, остатком и статусом', 'GadgetPick admin: products with SKU, price, margin, stock and status', 'light'),
  botSchedule: shot(botSchedule, 'Расписание на день: пары, преподаватели и подгруппы', 'Daily schedule: classes, teachers and subgroups', 'dark', { device: 'phone' }),
  botEvening: shot(botEvening, 'Вечерние пары и пометки об отменённых занятиях', 'Evening classes with cancellation notes', 'dark', { device: 'phone' }),
  botCalendar: shot(botCalendar, 'Календарь на месяц с количеством пар по дням', 'Month calendar showing the number of classes per day', 'dark', { device: 'phone' }),
  botGroups: shot(botGroups, 'Выбор группы: бакалавриат и магистратура, 1–5 курс', 'Group picker: bachelor’s and master’s, years 1–5', 'dark', { device: 'phone' }),
  botSettings: shot(botSettings, 'Настройки: режим студента, преподавателя или гостя, тема и акцентный цвет', 'Settings: student, teacher or guest mode, theme and accent color', 'dark', { device: 'phone' }),
  n8nMax: shot(n8nMax, 'n8n: зеркалирование каналов MAX → Telegram с AI-фильтром и маршрутизацией по типу медиа', 'n8n: MAX → Telegram channel mirroring with an AI filter and media-type routing', 'dark'),
  n8nYoutube: shot(n8nYoutube, 'n8n: пайплайн музыкального YouTube-канала — Suno, GPT Image, ffmpeg и загрузка на YouTube', 'n8n: music YouTube channel pipeline — Suno, GPT Image, ffmpeg and YouTube upload', 'dark'),
  labProxmox: shot(labProxmox, 'Proxmox VE: 10 LXC-контейнеров и 2 виртуальные машины на одном узле', 'Proxmox VE: 10 LXC containers and 2 VMs on a single node', 'dark'),
  labGrafana: shot(labGrafana, 'Grafana: температура, нагрузка, CPU и память хоста', 'Grafana: host temperature, load, CPU and memory', 'dark'),
  labTechnitium: shot(labTechnitium, 'Technitium DNS: аналитика запросов, кэш и блокировки', 'Technitium DNS: query analytics, caching and blocking', 'dark'),
  ccLanding: shot(ccLanding, 'Один из 50 продуктовых лендингов', 'One of the 50 product landing pages', 'dark'),
  ccCrm: shot(ccCrm, 'LeadVertex CRM: заказы и маршрутизация заявок', 'LeadVertex CRM: orders and lead routing', 'light'),
};

export const projects: Project[] = [
  {
    slug: 'voicemanager',
    featured: true,
    status: 'beta',
    tint: 'violet',
    title: { ru: 'VoiceManager', en: 'VoiceManager' },
    tag: { ru: 'AI-менеджер продаж', en: 'AI sales agent' },
    tagline: {
      ru: 'AI-менеджер исходящих продаж: голосовой агент на русском',
      en: 'An AI outbound sales rep: a Russian-speaking voice agent',
    },
    summary: {
      ru: 'Агент сам звонит клиентам, звучит как человек, спокойно переносит перебивания, отрабатывает возражения («дорого», «я подумаю») и доводит разговор до заказа или встречи. Аудио и записи не покидают РФ — западные API получают только текст.',
      en: 'The agent calls customers on its own, sounds human, copes with interruptions, works through objections (“too expensive”, “I’ll think about it”) and closes for an order or a meeting. Audio and recordings never leave Russia — Western APIs only ever see text.',
    },
    highlights: {
      ru: [
        'Целевая задержка voice-to-voice — меньше 900 мс',
        'Кабинет клиента: кампании, базы, логи звонков с транскриптами и данными для CRM',
        'Встроенный AI-ассистент управляет кабинетом прямо из диалога',
      ],
      en: [
        'Voice-to-voice latency target: under 900 ms',
        'Client dashboard: campaigns, contact lists, call logs with transcripts and CRM-ready data',
        'A built-in AI assistant runs the dashboard straight from a chat',
      ],
    },
    role: { ru: 'Автор продукта — от архитектуры до продакшена', en: 'Creator — from architecture to production' },
    period: { ru: '2026 — сейчас', en: '2026 — now' },
    stack: ['Python', 'LiveKit', 'Yandex SpeechKit', 'Gemini', 'ElevenLabs', 'Silero VAD', 'FastAPI', 'PostgreSQL', 'Docker'],
    cover: { kind: 'frame', shot: s.vmDashboard },
    gallery: [s.vmDashboard, s.vmCall, s.vmDashboardLight, s.vmSecurity, s.vmLogin],
    sections: [
      {
        title: { ru: 'Задача', en: 'The problem' },
        text: {
          ru: 'Исходящие продажи по телефону — дорогая и плохо масштабируемая работа. VoiceManager берёт на себя первую линию: агент звонит по базе, ведёт живой диалог и передаёт в CRM готовый заказ — с товарами, адресом и удобным временем доставки.',
          en: 'Outbound phone sales are expensive and hard to scale. VoiceManager takes over the first line: the agent dials through a contact list, holds a natural conversation and hands a ready order to the CRM — items, address and preferred delivery time included.',
        },
      },
      {
        title: { ru: 'Как устроено', en: 'How it works' },
        diagram: 'voice',
        text: {
          ru: 'Голосовой пайплайн работает поверх self-hosted LiveKit: Silero VAD и русский turn detector понимают, когда человек закончил фразу. Речь распознаёт Yandex SpeechKit v3 напрямую из РФ. Ответ генерирует LLM через подключаемый адаптер — по умолчанию собственный шлюз V2Horizon к Gemini, а также YandexGPT напрямую или OpenRouter через прокси. Перед синтезом текст нормализуется (числа, ударения), озвучивает его ElevenLabs — Flash v2.5 по умолчанию или v3 для качества — с дисковым кэшем частых фраз.',
          en: 'The voice pipeline runs on self-hosted LiveKit: Silero VAD and a Russian turn detector tell when the person has finished speaking. Speech is recognised by Yandex SpeechKit v3 directly from Russia. Replies come from an LLM behind a pluggable adapter — by default my own V2Horizon gateway to Gemini, with YandexGPT direct or OpenRouter via proxy as alternatives. Text is normalised before synthesis (numbers, stress marks) and voiced by ElevenLabs — Flash v2.5 by default or v3 for quality — with an on-disk cache for frequent phrases.',
        },
      },
      {
        title: { ru: 'Кабинет клиента', en: 'Client dashboard' },
        list: {
          ru: [
            'Кампании с модерацией: приветствие, факты о товаре, отработка возражений, допродажи',
            'Базы контактов, обзвон и тестовая среда, чтобы послушать агента прямо из браузера',
            'Логи звонков: транскрипт, итог (заказ, перезвонить, отказ), длительность и данные, собранные для CRM',
            'Дашборд: дозвон, конверсия в заказ, воронка и ритм обзвона за 30 дней',
            'Безопасность: двухфакторный вход, API-ключи для интеграций, управление сеансами',
            'AI-ассистент отвечает на вопросы, ставит кампании на паузу и правит настройки — каждое действие фиксируется в диалоге',
          ],
          en: [
            'Moderated campaigns: greeting, product facts, objection handling, upsells',
            'Contact lists, dialing and a test environment to hear the agent right in the browser',
            'Call logs: transcript, outcome (order, call back, refusal), duration and CRM-ready data',
            'Dashboard: pick-up rate, order conversion, call funnel and 30-day activity',
            'Security: two-factor sign-in, integration API keys, session management',
            'The AI assistant answers questions, pauses campaigns and edits settings — every action is logged in the chat',
          ],
        },
      },
    ],
    cv: {
      ru: 'Голосовой AI-агент для исходящих продаж на русском: LiveKit, Yandex SpeechKit, LLM-адаптер (Gemini / YandexGPT / OpenRouter), ElevenLabs; кабинет клиента с логами звонков, данными для CRM, 2FA и AI-ассистентом.',
      en: 'Russian-speaking voice AI agent for outbound sales: LiveKit, Yandex SpeechKit, pluggable LLM adapter (Gemini / YandexGPT / OpenRouter), ElevenLabs; client dashboard with call logs, CRM-ready data, 2FA and an AI assistant.',
    },
  },
  {
    slug: 'gadgetpick',
    featured: true,
    status: 'prod',
    tint: 'sand',
    title: { ru: 'GadgetPick', en: 'GadgetPick' },
    tag: { ru: 'интернет-магазин', en: 'online store' },
    tagline: {
      ru: 'Интернет-магазин с нуля: витрина, админка и AI-автоматизации',
      en: 'An online store from scratch: storefront, admin panel and AI automation',
    },
    summary: {
      ru: 'Все компоненты магазина трендовых товаров для дома, сада и дороги сделаны с нуля: сайт, онлайн-оплата, интеграция с Битрикс24 и регистрация по SMS. Плюс собственная админ-панель с аналитикой и AI-студией для контента.',
      en: 'Every part of an online store for home, garden and travel gadgets, built from scratch: the website, online payments, Bitrix24 CRM integration and SMS sign-up — plus a custom admin panel with analytics and an AI content studio.',
    },
    highlights: {
      ru: [
        'Админка: аналитика продаж, калькулятор прибыли, рекламные кампании и статистика по каждому товару',
        'AI генерирует картинки для карточек, описания и SEO; умный поиск, подборки и бандлы',
        'Автоматические SMS-уведомления на каждом этапе сделки',
      ],
      en: [
        'Admin: sales analytics, profit calculator, ad campaigns and per-product stats',
        'AI generates product images, descriptions and SEO; smart search, collections and bundles',
        'Automatic SMS notifications at every stage of a deal',
      ],
    },
    role: { ru: 'Разработка с нуля: витрина, админка, интеграции, AI', en: 'Built from scratch: storefront, admin, integrations, AI' },
    period: { ru: '2026', en: '2026' },
    stack: ['MedusaJS', 'React', 'PostgreSQL', 'Bitrix24', 'LLM', 'SMS API'],
    link: { href: 'https://gadgetpick.ru', label: 'gadgetpick.ru' },
    cover: { kind: 'frame', shot: s.gpStorefront },
    gallery: [s.gpStorefront, s.gpCatalog, s.gpAdmin],
    sections: [
      {
        title: { ru: 'Магазин', en: 'The store' },
        list: {
          ru: [
            'Витрина с каталогом, фильтрами по цене и брендам, подборками дня',
            'Покупка в 1 клик, онлайн-оплата и оплата при получении с чеком по 54-ФЗ',
            'Регистрация и вход по SMS',
            'Заказы уходят в Битрикс24, клиент получает SMS на каждом этапе сделки',
          ],
          en: [
            'Storefront with a catalog, price and brand filters, and daily picks',
            'One-click purchase, online payment and cash on delivery with fiscal receipts',
            'Sign-up and sign-in via SMS',
            'Orders flow into Bitrix24; customers get an SMS at every stage of the deal',
          ],
        },
      },
      {
        title: { ru: 'Админ-панель', en: 'Admin panel' },
        list: {
          ru: [
            'Дашборд и аналитика продаж, топ товаров, статистика по каждому товару',
            'Калькулятор прибыли и маржа по каждой позиции',
            'Каталог: товары, склад, бренды, категории и подборки',
            'Заказы, заявки в 1 клик, возвраты, промокоды и комбо «Вместе дешевле»',
            'Клиенты, отзывы и обращения; веб-мастера и рекламные кампании со статистикой',
            'Настройки интеграций и встроенный AI-ассистент',
          ],
          en: [
            'Dashboard and sales analytics, top products, per-product statistics',
            'Profit calculator and margin for every item',
            'Catalog: products, stock, brands, categories and collections',
            'Orders, one-click requests, returns, promo codes and “better together” bundles',
            'Customers, reviews and support requests; affiliates and ad campaigns with stats',
            'Integration settings and a built-in AI assistant',
          ],
        },
      },
      {
        title: { ru: 'AI-автоматизации', en: 'AI automation' },
        list: {
          ru: [
            'AI-студия: генерация изображений для карточек товаров',
            'Автоматические описания и SEO-тексты',
            'Умный поиск и подборки, сборка бандлов для продажи',
          ],
          en: [
            'AI studio: image generation for product cards',
            'Automatic product descriptions and SEO copy',
            'Smart search and collections, bundle building for upsells',
          ],
        },
      },
    ],
    cv: {
      ru: 'Интернет-магазин с нуля: витрина на React, бэкенд на MedusaJS, онлайн-оплата, Битрикс24, SMS-регистрация; админка с аналитикой и калькулятором прибыли; AI-генерация картинок, описаний и SEO.',
      en: 'Online store from scratch: React storefront, MedusaJS backend, online payments, Bitrix24, SMS sign-up; admin with analytics and a profit calculator; AI-generated images, descriptions and SEO.',
    },
  },
  {
    slug: 'mpgu-bot',
    featured: true,
    status: 'prod',
    tint: 'blue',
    title: { ru: 'Бот с расписанием', en: 'Schedule bot' },
    tag: { ru: 'Telegram Mini App', en: 'Telegram Mini App' },
    tagline: {
      ru: 'Telegram-бот и Mini App с расписанием и AI-ассистентом для 3 300+ студентов',
      en: 'A Telegram bot and Mini App with class schedules and an AI assistant for 3,300+ students',
    },
    summary: {
      ru: 'Расписание групп и преподавателей прямо в Telegram: пары на день, календарь на месяц, уведомления об изменениях и диалог с AI. Новый интерфейс Mini App — со светлой и тёмной темами, акцентными цветами и живыми фонами.',
      en: 'Group and teacher schedules right inside Telegram: today’s classes, a month calendar, change notifications and an AI chat. The new Mini App UI comes with light and dark themes, accent colors and animated backgrounds.',
    },
    highlights: {
      ru: [
        'Три режима: студент, преподаватель (поиск по фамилии) и гость — только диалог с AI',
        'Уведомления об изменениях в расписании и календарь с количеством пар по дням',
        'Деплой, on-call, мониторинг и AI-интеграции через OpenRouter',
      ],
      en: [
        'Three modes: student, teacher (search by surname) and guest — AI chat only',
        'Schedule change notifications and a calendar showing classes per day',
        'Deployment, on-call, monitoring and AI integrations via OpenRouter',
      ],
    },
    role: { ru: 'Инфраструктура, сопровождение, новые функции и AI-слой', en: 'Infrastructure, operations, new features and the AI layer' },
    period: { ru: '2025 — сейчас', en: '2025 — now' },
    stack: ['TypeScript', 'NestJS', 'Telegram Mini App', 'PostgreSQL', 'Redis', 'RabbitMQ', 'OpenRouter'],
    link: { href: 'https://t.me/mpgu_imo_bot', label: '@mpgu_imo_bot' },
    cover: { kind: 'phones', shots: [s.botCalendar, s.botSchedule, s.botSettings] },
    gallery: [s.botSchedule, s.botEvening, s.botCalendar, s.botGroups, s.botSettings],
    sections: [
      {
        title: { ru: 'О проекте', en: 'About' },
        text: {
          ru: 'Бот — ежедневный инструмент студентов МПГУ. Исходный код создан командой из двух разработчиков; роль в проекте — инфраструктура, сопровождение, новые функции и AI-слой. На основе бота подготовлена ВКР «Адаптивная образовательная платформа с использованием технологий ИИ» с апробацией на 3 350+ пользователях.',
          en: 'The bot is a daily tool for MPGU students. The original code was written by a two-person team; the role in the project covers infrastructure, operations, new features and the AI layer. The bachelor’s thesis “An adaptive learning platform powered by AI” is built on it and was piloted with 3,350+ users.',
        },
      },
      {
        title: { ru: 'Что умеет', en: 'Features' },
        list: {
          ru: [
            'Пары на день: преподаватель, подгруппа, пометки об отменах',
            'Календарь на месяц с количеством пар по дням',
            'Выбор группы: бакалавриат и магистратура, 1–5 курс',
            'Режим преподавателя — занятия ищутся по фамилии',
            'Гостевой режим — только диалог с AI, без расписания',
            'Уведомления об изменениях в расписании',
            'Оформление: авто, светлая или тёмная тема, 8 акцентных цветов, живой фон',
          ],
          en: [
            'Daily classes: teacher, subgroup, cancellation notes',
            'A month calendar with the number of classes per day',
            'Group picker: bachelor’s and master’s, years 1–5',
            'Teacher mode — classes are looked up by surname',
            'Guest mode — AI chat only, no schedule',
            'Schedule change notifications',
            'Appearance: auto, light or dark theme, 8 accent colors, animated background',
          ],
        },
      },
      {
        title: { ru: 'Как устроено', en: 'Under the hood' },
        text: {
          ru: 'Монорепозиторий на Turborepo: NestJS-приложение бота и семь общих пакетов — конфиг с валидацией через Zod, Prisma, Redis с распределёнными блокировками, RabbitMQ для асинхронных событий, логгер с алертами в Telegram и клиент портала МПГУ, который устойчиво забирает расписание и отслеживает изменения.',
          en: 'A Turborepo monorepo: the NestJS bot app plus seven shared packages — Zod-validated config, Prisma, Redis with distributed locks, RabbitMQ for async events, a logger that alerts to Telegram and an MPGU portal client that fetches schedules resiliently and detects changes.',
        },
      },
    ],
    cv: {
      ru: 'Telegram-бот и Mini App с расписанием и AI-ассистентом для 3 300+ студентов МПГУ: NestJS, PostgreSQL, Redis, RabbitMQ, OpenRouter; деплой, on-call, мониторинг.',
      en: 'Telegram bot and Mini App with schedules and an AI assistant for 3,300+ MPGU students: NestJS, PostgreSQL, Redis, RabbitMQ, OpenRouter; deployment, on-call, monitoring.',
    },
  },
  {
    slug: 'diagnostic-assistant',
    featured: true,
    status: 'personal',
    tint: 'teal',
    title: { ru: 'Diagnostic Assistant', en: 'Diagnostic Assistant' },
    tag: { ru: 'медицинский AI', en: 'medical AI' },
    tagline: {
      ru: 'Диагностический ассистент на верифицированной медицинской истории одного человека',
      en: 'A diagnostic assistant built on one person’s verified medical history',
    },
    summary: {
      ru: 'Строит дифференциальный ряд, находит недостающие данные и формирует план обследования и предварительного лечения — для обсуждения с врачом, а не вместо него.',
      en: 'It builds a differential diagnosis, spots missing data and drafts an examination and preliminary treatment plan — to discuss with a doctor, not to replace one.',
    },
    highlights: {
      ru: [
        'Держит в контексте то, чего нет у врача на приёме: 15 лет анамнеза, динамику анализов и заключения одновременно',
        'Provenance до скана: у каждого факта есть ссылка на исходный документ',
        'Каждый вывод и план лечения помечен как требующий одобрения врача — шаблоном на уровне рендеринга, а не на усмотрение модели',
      ],
      en: [
        'Keeps in view what a doctor doesn’t have at an appointment: 15 years of history, lab trends and reports — all at once',
        'Provenance down to the scan: every fact links back to its source document',
        'Every conclusion and treatment plan is flagged as needing a physician’s approval — enforced by the rendering template, not left to the model',
      ],
    },
    role: { ru: 'Автор', en: 'Creator' },
    period: { ru: '2026', en: '2026' },
    stack: ['LLM', 'Provenance', 'Human-in-the-loop'],
    note: { ru: 'Не медицинское изделие.', en: 'Not a medical device.' },
    cover: { kind: 'diagram', diagram: 'diagnostic' },
    gallery: [],
    sections: [
      {
        title: { ru: 'Идея', en: 'The idea' },
        text: {
          ru: 'Ценность в том, чего у врача на приёме нет: пятнадцать лет анамнеза, лабораторной динамики и заключений одновременно — и у каждого факта provenance до скана. Ассистент не ставит диагноз, а готовит материал для разговора с врачом: дифференциальный ряд, недостающие данные, план обследования и предварительного лечения.',
          en: 'The value is what a doctor doesn’t have at an appointment: fifteen years of history, lab trends and reports at once — with provenance down to the scan for every fact. The assistant doesn’t diagnose; it prepares material for a conversation with a doctor: a differential diagnosis, missing data, an examination and preliminary treatment plan.',
        },
      },
      {
        title: { ru: 'Как устроено', en: 'How it works' },
        diagram: 'diagnostic',
      },
      {
        title: { ru: 'Ограничения — по дизайну', en: 'Guardrails by design' },
        text: {
          ru: 'Не медицинское изделие. Каждый диагностический вывод и каждый план лечения несут пометку о необходимости одобрения квалифицированного врача. Её ставит шаблон на уровне рендеринга — модель не может её пропустить или «забыть».',
          en: 'Not a medical device. Every diagnostic conclusion and every treatment plan carries a note that it must be approved by a qualified physician. The rendering template adds it — the model can’t skip or “forget” it.',
        },
      },
    ],
    cv: {
      ru: 'Личный диагностический ассистент на верифицированной медицинской истории: дифференциальный ряд, недостающие данные, план обследования; provenance до скана, обязательная пометка об одобрении врача на уровне шаблона.',
      en: 'Personal diagnostic assistant on a verified medical history: differential diagnosis, missing data, examination plan; provenance down to the scan, mandatory physician-approval flag enforced by the template.',
    },
  },
  {
    slug: 'automations',
    featured: false,
    status: 'prod',
    tint: 'coral',
    title: { ru: 'n8n-пайплайны', en: 'n8n pipelines' },
    tag: { ru: 'AI-автоматизации', en: 'AI automation' },
    tagline: {
      ru: 'Продакшен-пайплайны: мессенджеры, генерация контента и публикация',
      en: 'Production pipelines: messengers, content generation and publishing',
    },
    summary: {
      ru: 'Self-hosted n8n с флоу на десятки узлов, ретраями и алертами в Telegram. Пайплайны переживают падения внешних API и работают без присмотра.',
      en: 'Self-hosted n8n with flows of dozens of nodes, retries and Telegram alerts. The pipelines survive upstream API failures and run unattended.',
    },
    highlights: {
      ru: [
        'Зеркалирование каналов MAX → Telegram: вебхук Green-API, дедупликация, AI-фильтр и склейка серий сообщений, маршрутизация по типу медиа, запись в БД',
        'Автономный музыкальный YouTube-канал: LLM пишет план, Suno генерирует 10 треков, GPT Image — обложку, ffmpeg рендерит MP4, затем загрузка на YouTube и уведомление в Telegram — каждые 2 дня',
        'AI-генерация постов для соцсетей и фото для карточек товаров',
      ],
      en: [
        'MAX → Telegram channel mirroring: Green-API webhook, deduplication, an AI filter that merges message bursts, media-type routing, DB writes',
        'A self-running music YouTube channel: an LLM writes the plan, Suno makes 10 tracks, GPT Image the cover, ffmpeg renders the MP4, then YouTube upload and a Telegram ping — every 2 days',
        'AI-generated social media posts and product photos',
      ],
    },
    role: { ru: 'Проектирование, разработка и поддержка', en: 'Design, build and support' },
    period: { ru: '2025 — сейчас', en: '2025 — now' },
    stack: ['n8n', 'OpenRouter', 'Green-API', 'Telegram API', 'Kie.ai', 'Suno', 'ffmpeg', 'YouTube API'],
    cover: { kind: 'frame', shot: s.n8nMax },
    gallery: [s.n8nMax, s.n8nYoutube],
    sections: [
      {
        title: { ru: 'Пайплайны', en: 'Pipelines' },
        list: {
          ru: [
            'MAX → Telegram: сообщения из каналов MAX приходят через Green-API, проходят дедупликацию и AI-фильтр, серии сообщений склеиваются, медиа маршрутизируется по типу (фото, видео, аудио, документы), правки синхронизируются, всё пишется в БД',
            'Музыкальный YouTube-канал: LLM через OpenRouter составляет творческий план, Suno (через Kie.ai) генерирует 10 треков, GPT Image 2 рисует обложку 16:9, локальный воркер с ffmpeg рендерит MP4, затем resumable-загрузка на YouTube, уведомление в Telegram и очистка файлов — по расписанию каждые 2 дня',
            'Контент для соцсетей и каталога: AI-генерация постов и фото товаров',
          ],
          en: [
            'MAX → Telegram: posts from MAX channels arrive via Green-API, get deduplicated and AI-filtered, message bursts are merged, media is routed by type (photo, video, audio, documents), edits are synced and everything is written to a DB',
            'Music YouTube channel: an LLM via OpenRouter drafts a creative plan, Suno (via Kie.ai) generates 10 tracks, GPT Image 2 draws a 16:9 cover, a local ffmpeg worker renders the MP4, then a resumable YouTube upload, a Telegram notification and cleanup — on a schedule every 2 days',
            'Social and catalog content: AI-generated posts and product photos',
          ],
        },
      },
      {
        title: { ru: 'Надёжность', en: 'Reliability' },
        text: {
          ru: 'Флоу версионируются и мониторятся, ретраи и алерты в Telegram страхуют от падений внешних API, а история выполнений показывает, где и сколько времени занял каждый запуск.',
          en: 'Flows are versioned and monitored; retries and Telegram alerts cover upstream API failures, and the execution history shows where each run spent its time.',
        },
      },
    ],
    cv: {
      ru: 'Продакшен-пайплайны на self-hosted n8n: зеркалирование MAX → Telegram с AI-фильтром; автономный музыкальный YouTube-канал (Suno, GPT Image, ffmpeg, YouTube API); AI-контент для соцсетей и каталога.',
      en: 'Production pipelines on self-hosted n8n: MAX → Telegram mirroring with an AI filter; a self-running music YouTube channel (Suno, GPT Image, ffmpeg, YouTube API); AI content for social media and catalogs.',
    },
  },
  {
    slug: 'homelab',
    featured: false,
    status: 'prod',
    tint: 'slate',
    title: { ru: 'Homelab', en: 'Homelab' },
    tag: { ru: 'Proxmox и мониторинг', en: 'Proxmox & monitoring' },
    tagline: {
      ru: 'Личное облако на Proxmox: 10 LXC + 2 VM, ~99% uptime',
      en: 'A personal cloud on Proxmox: 10 LXC + 2 VM, ~99% uptime',
    },
    summary: {
      ru: 'Single-node Proxmox на мини-ПК для развёртывания, мониторинга и резервного копирования собственных сервисов: git, n8n, базы данных, LMS, стенд Kubernetes на k3s, observability-стек и локальный DNS — за единым reverse proxy.',
      en: 'A single-node Proxmox mini-PC for deploying, monitoring and backing up own services: git, n8n, databases, an LMS, a k3s Kubernetes sandbox, an observability stack and local DNS — behind one reverse proxy.',
    },
    highlights: {
      ru: [
        'Prometheus + node_exporter + pve-exporter собирают метрики с хоста и каждого контейнера, дашборды в Grafana',
        'Technitium DNS: split-DNS для приватных доменов, кэширование, аналитика по клиентам',
        'Автобэкапы, ZFS-снапшоты и алерты в Telegram; ~99% uptime за 12+ месяцев',
      ],
      en: [
        'Prometheus + node_exporter + pve-exporter scrape the host and every container; dashboards in Grafana',
        'Technitium DNS: split DNS for private domains, caching, per-client analytics',
        'Automated backups, ZFS snapshots and Telegram alerts; ~99% uptime over 12+ months',
      ],
    },
    role: { ru: 'Полный цикл: от железа до алертов', en: 'Full cycle: from hardware to alerts' },
    period: { ru: '2025 — сейчас', en: '2025 — now' },
    stack: ['Proxmox VE', 'LXC', 'NPMplus', 'PostgreSQL', 'Gitea', 'k3s', 'Prometheus', 'Grafana', 'Technitium DNS'],
    cover: { kind: 'frame', shot: s.labGrafana },
    gallery: [s.labProxmox, s.labGrafana, s.labTechnitium],
    sections: [
      {
        title: { ru: 'Архитектура', en: 'Architecture' },
        diagram: 'homelab',
        text: {
          ru: 'Снаружи — DNS в Cloudflare и проброс 443 порта на NPMplus, который терминирует TLS и раздаёт трафик по сервисам. Приложения живут в отдельных LXC, Frappe LMS и стенд k3s — в QEMU-виртуалках, общая PostgreSQL обслуживает четыре с лишним сервиса.',
          en: 'Outside: DNS on Cloudflare and port 443 forwarded to NPMplus, which terminates TLS and routes traffic to services. Apps live in separate LXC containers, Frappe LMS and a k3s sandbox in QEMU VMs, and a shared PostgreSQL serves four-plus services.',
        },
      },
      {
        title: { ru: 'Наблюдаемость', en: 'Observability' },
        list: {
          ru: [
            'Метрики CPU, памяти, дисков и сети на уровне каждого контейнера, scrape раз в 15 секунд',
            'Дашборды Grafana по хосту: температуры, нагрузка, режимы CPU, память',
            'Алерты в Telegram при аномалиях и сбоях',
          ],
          en: [
            'Per-container CPU, memory, disk and network metrics, scraped every 15 seconds',
            'Grafana host dashboards: temperatures, load, CPU modes, memory',
            'Telegram alerts on anomalies and failures',
          ],
        },
      },
    ],
    cv: {
      ru: 'Homelab на Proxmox VE: 10 LXC + 2 VM (Frappe LMS, k3s) за NPMplus; Prometheus + Grafana, Technitium DNS со split-DNS, автобэкапы и ZFS-снапшоты, алерты в Telegram; ~99% uptime за 12+ месяцев.',
      en: 'Proxmox VE homelab: 10 LXC + 2 VMs (Frappe LMS, k3s) behind NPMplus; Prometheus + Grafana, Technitium split DNS, automated backups and ZFS snapshots, Telegram alerts; ~99% uptime over 12+ months.',
    },
  },
  {
    slug: 'call-center',
    featured: false,
    status: 'done',
    tint: 'amber',
    title: { ru: 'Колл-центр', en: 'Call center' },
    tag: { ru: 'Asterisk на 40 мест', en: 'Asterisk for 40 seats' },
    tagline: {
      ru: 'Вся техника раннего стартапа: телефония на 40 операторов, 50 лендингов, балансировщик',
      en: 'The whole tech side of an early startup: telephony for 40 agents, 50 landing pages, load balancing',
    },
    summary: {
      ru: 'Единственный инженер в e-commerce-стартапе из трёх человек: полная ответственность за техническую часть — от провижининга серверов до деплоя и разбора инцидентов. Инфраструктура работает до сих пор.',
      en: 'The only engineer in a three-person e-commerce startup, with full ownership of the technical side — from server provisioning to deployments and incident response. The infrastructure is still running.',
    },
    highlights: {
      ru: [
        'Asterisk/FreePBX с нуля для колл-центра на ~40 операторов: SIP-транк, IVR, запись звонков, базовая аналитика',
        '50 продуктовых лендингов с передачей заявок в LeadVertex CRM',
        'Балансировщик на 2 backend-ноды и Whisper-транскрипция входящих звонков с автоклассификацией в CRM',
      ],
      en: [
        'Asterisk/FreePBX from scratch for a ~40-agent call center: SIP trunk, IVR, call recording, basic analytics',
        '50 product landing pages with leads routed into LeadVertex CRM',
        'A load balancer over 2 backend nodes and Whisper transcription of inbound calls with auto-classification in the CRM',
      ],
    },
    role: { ru: 'Founding Engineer', en: 'Founding Engineer' },
    period: { ru: 'Апр — Ноя 2025', en: 'Apr — Nov 2025' },
    stack: ['Asterisk', 'FreePBX', 'SIP', 'LeadVertex', 'Nginx', 'Docker', 'Whisper'],
    cover: {
      kind: 'numbers',
      items: [
        { value: '40', label: { ru: 'операторов на Asterisk / FreePBX: SIP-транк, IVR, запись', en: 'agents on Asterisk / FreePBX: SIP trunk, IVR, recording' } },
        { value: '50', label: { ru: 'продуктовых лендингов с заявками в LeadVertex CRM', en: 'product landing pages feeding LeadVertex CRM' } },
        { value: '2', label: { ru: 'backend-ноды за балансировщиком, Whisper-транскрипция', en: 'backend nodes behind a load balancer, Whisper transcription' } },
      ],
    },
    gallery: [s.ccLanding, s.ccCrm],
    sections: [
      {
        title: { ru: 'Что сделано', en: 'What I built' },
        list: {
          ru: [
            'Телефония для колл-центра на ~40 операторов на Asterisk/FreePBX: SIP-транк с провайдером, IVR, запись звонков, базовая аналитика',
            '50 продуктовых лендингов с передачей заявок в LeadVertex CRM',
            'Балансировщик нагрузки на 2 backend-ноды для основного интернет-магазина',
            'Whisper-транскрипция входящих звонков и автоматическая классификация обращений в CRM',
          ],
          en: [
            'Telephony for a ~40-agent call center on Asterisk/FreePBX: SIP trunk, IVR, call recording, basic analytics',
            '50 product landing pages with leads routed into LeadVertex CRM',
            'A load balancer over 2 backend nodes for the main online store',
            'Whisper transcription of inbound calls with automatic request classification in the CRM',
          ],
        },
      },
    ],
    cv: {
      ru: 'Техника e-commerce-стартапа: Asterisk/FreePBX на ~40 операторов, 50 лендингов с заявками в LeadVertex CRM, балансировщик на 2 ноды, Whisper-транскрипция звонков.',
      en: 'E-commerce startup tech: Asterisk/FreePBX for ~40 agents, 50 landing pages feeding LeadVertex CRM, a 2-node load balancer, Whisper call transcription.',
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
