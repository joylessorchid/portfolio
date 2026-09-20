import type { L10n } from '../i18n/ui';

export interface Job {
  role: L10n;
  org: L10n;
  /** Для PDF-резюме: название можно раскрыть подробнее, чем на сайте. */
  orgCv?: L10n;
  period: L10n;
  current?: boolean;
  /** Одна строка для главной страницы. */
  summary: L10n;
  bullets: L10n<string[]>;
  stack: string[];
}

export interface Study {
  org: L10n;
  program: L10n;
  period: L10n;
  current?: boolean;
  details: L10n;
}

export const jobs: Job[] = [
  {
    role: { ru: 'Фриланс и собственные продукты', en: 'Freelance & own products' },
    org: { ru: 'V2Horizon', en: 'V2Horizon' },
    period: { ru: '2026 — сейчас', en: '2026 — now' },
    current: true,
    summary: { ru: 'VoiceManager, GadgetPick, AI-пайплайны на n8n', en: 'VoiceManager, GadgetPick, AI pipelines on n8n' },
    bullets: {
      ru: [
        'Разработка VoiceManager — голосового AI-агента для исходящих продаж с кабинетом клиента',
        'Интернет-магазин GadgetPick с нуля: витрина, админ-панель, оплата, Битрикс24, AI-автоматизации',
        'AI-пайплайны на n8n и сопровождение инфраструктуры проектов',
      ],
      en: [
        'Development of VoiceManager — a voice AI agent for outbound sales with a client dashboard',
        'The GadgetPick online store from scratch: storefront, admin panel, payments, Bitrix24, AI automation',
        'AI pipelines on n8n and infrastructure operations for the projects',
      ],
    },
    stack: ['Python', 'LiveKit', 'MedusaJS', 'React', 'n8n', 'Docker'],
  },
  {
    role: { ru: 'Техник', en: 'Technician' },
    org: { ru: 'МПГУ · Центр стратегической работы с абитуриентами', en: 'MPGU · Center for Strategic Work with Applicants' },
    period: { ru: 'Янв 2025 — май 2026', en: 'Jan 2025 — May 2026' },
    summary: {
      ru: 'Production-бот для 4 700+ студентов, Frappe LMS, Jitsi, Nextcloud, мониторинг; менторство 10+ студентов',
      en: 'Production bot for 4,700+ students, Frappe LMS, Jitsi, Nextcloud, monitoring; mentoring 10+ students',
    },
    bullets: {
      ru: [
        'Сопровождение production Telegram-бота @mpgu_imo_bot для 4 700+ студентов: деплой, on-call, мониторинг, AI-интеграции через OpenRouter',
        'Развёртывание и сопровождение сервисов института: Frappe LMS, Jitsi, Nextcloud, мониторинг на Grafana + Prometheus',
        'Менторство 10+ первокурсников-программистов: технические задания, код-ревью, онбординг',
      ],
      en: [
        'Operation of the production Telegram bot @mpgu_imo_bot for 4,700+ students: deployment, on-call, monitoring, AI integrations via OpenRouter',
        'Deployment and maintenance of institute services: Frappe LMS, Jitsi, Nextcloud, monitoring with Grafana + Prometheus',
        'Mentoring 10+ first-year CS students: task specs, code review, onboarding',
      ],
    },
    stack: ['Linux', 'Docker', 'PostgreSQL', 'n8n', 'Grafana', 'OpenRouter'],
  },
  {
    role: { ru: 'Founding Engineer', en: 'Founding Engineer' },
    org: { ru: 'E-commerce стартап · команда из 3 человек', en: 'E-commerce startup · team of 3' },
    orgCv: { ru: 'E-commerce стартап (24connect-hub.ru) · команда из 3 человек', en: 'E-commerce startup (24connect-hub.ru) · team of 3' },
    period: { ru: 'Апр — ноя 2025', en: 'Apr — Nov 2025' },
    summary: {
      ru: 'Asterisk на 40 операторов, 50 лендингов, балансировщик, Whisper-транскрипция звонков',
      en: 'Asterisk for 40 agents, 50 landing pages, load balancer, Whisper call transcription',
    },
    bullets: {
      ru: [
        'Единоличная ответственность за техническую часть: серверы, телефония, CRM-интеграции, лендинги',
        'Asterisk/FreePBX с нуля для колл-центра на ~40 операторов: SIP-транк, IVR, запись, аналитика',
        'Запуск 50 продуктовых лендингов с передачей заявок в LeadVertex CRM',
        'Балансировщик на 2 backend-ноды и Whisper-транскрипция звонков с классификацией обращений',
      ],
      en: [
        'Sole ownership of the technical side: servers, telephony, CRM integrations, landing pages',
        'Asterisk/FreePBX from scratch for a ~40-agent call center: SIP trunk, IVR, recording, analytics',
        'Launch of 50 product landing pages with leads routed into LeadVertex CRM',
        'A load balancer over 2 backend nodes and Whisper call transcription with request classification',
      ],
    },
    stack: ['Linux', 'Nginx', 'Docker', 'Asterisk', 'FreePBX', 'LeadVertex', 'Whisper'],
  },
  {
    role: { ru: 'Техническая поддержка', en: 'Technical support' },
    org: { ru: 'МПГУ · Центр развития дистанционного образования', en: 'MPGU · Distance Learning Development Center' },
    period: { ru: 'Апр — окт 2024', en: 'Apr — Oct 2024' },
    summary: {
      ru: 'Онлайн-школа на Frappe LMS: Docker Compose, MariaDB, Nginx, инциденты и бэкапы',
      en: 'An online school on Frappe LMS: Docker Compose, MariaDB, Nginx, incidents and backups',
    },
    bullets: {
      ru: [
        'Развёртывание и сопровождение онлайн-школы на Frappe LMS: Docker Compose, MariaDB, Nginx, бэкапы',
        'Разбор инцидентов: конфликты авторизации MariaDB, расширение LVM-тома, права на загрузку в Nginx',
        'Дизайн и фронтенд страниц курсов, шаблоны лендингов',
      ],
      en: [
        'Deployment and maintenance of an online school on Frappe LMS: Docker Compose, MariaDB, Nginx, backups',
        'Incident handling: MariaDB auth conflicts, LVM volume expansion, Nginx upload permissions',
        'Design and front-end of course pages and landing templates',
      ],
    },
    stack: ['Frappe', 'Docker', 'MariaDB', 'Nginx', 'Figma'],
  },
];

export const education: Study[] = [
  {
    org: { ru: 'НИУ ВШЭ', en: 'HSE University' },
    program: { ru: 'Магистратура «ЛигалТех (Legal Tech)»', en: 'Master’s programme in LegalTech' },
    period: { ru: '2026 — 2028', en: '2026 — 2028' },
    current: true,
    details: {
      ru: 'Два диплома: 40.04.01 «Юриспруденция» и 01.04.02 «Прикладная математика и информатика». Автоматизация юридических процессов, анализ данных, машиночитаемое право.',
      en: 'Dual degree: Law (40.04.01) and Applied Mathematics & Computer Science (01.04.02). Legal process automation, data analysis, machine-readable law.',
    },
  },
  {
    org: { ru: 'МПГУ', en: 'Moscow Pedagogical State University' },
    program: { ru: 'Бакалавриат · 09.03.02 «Информационные системы и технологии»', en: 'Bachelor’s in Information Systems & Technology' },
    period: { ru: '2022 — 2026', en: '2022 — 2026' },
    details: {
      ru: 'Профиль «Гейм-дизайн и виртуальная реальность». ВКР — «Адаптивная образовательная платформа с использованием технологий ИИ»: Telegram-бот, LLM-маршрутизация через OpenRouter, PostgreSQL; апробация на 3 350+ пользователях.',
      en: 'Game design & VR track. Thesis: “An adaptive learning platform powered by AI” — a Telegram bot with LLM routing via OpenRouter and PostgreSQL, piloted with 3,350+ users.',
    },
  },
];
