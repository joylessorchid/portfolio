import type { L10n } from '../i18n/ui';

export interface Service {
  title: L10n;
  text: L10n;
  /** slug-и проектов, которые подтверждают услугу; первый — цель ссылки */
  proof: string[];
}

export const services: Service[] = [
  {
    title: { ru: 'AI-агенты и ассистенты', en: 'AI agents & assistants' },
    text: {
      ru: 'Голосовые и чат-агенты, ассистенты внутри продукта, LLM в бизнес-процессах — с учётом требований к хранению данных в РФ.',
      en: 'Voice and chat agents, in-product assistants, LLMs in business processes — with data-residency requirements in mind.',
    },
    proof: ['voicemanager', 'diagnostic-assistant', 'mpgu-bot'],
  },
  {
    title: { ru: 'Интернет-магазины и веб-сервисы', en: 'Online stores & web services' },
    text: {
      ru: 'Витрина, админ-панель, онлайн-оплата, CRM и SMS под ключ — с аналитикой и AI-инструментами для контента.',
      en: 'Storefront, admin panel, online payments, CRM and SMS, end to end — with analytics and AI content tools.',
    },
    proof: ['gadgetpick', 'call-center'],
  },
  {
    title: { ru: 'Автоматизация процессов', en: 'Process automation' },
    text: {
      ru: 'Пайплайны на n8n, Telegram-боты и Mini Apps, интеграции с CRM и мессенджерами, AI-генерация и маршрутизация контента.',
      en: 'n8n pipelines, Telegram bots and Mini Apps, CRM and messenger integrations, AI content generation and routing.',
    },
    proof: ['automations', 'mpgu-bot'],
  },
  {
    title: { ru: 'Инфраструктура и DevOps', en: 'Infrastructure & DevOps' },
    text: {
      ru: 'Серверы и VPS, Docker, reverse proxy и TLS, мониторинг и алерты, бэкапы, IP-телефония на Asterisk.',
      en: 'Servers and VPS, Docker, reverse proxies and TLS, monitoring and alerting, backups, Asterisk telephony.',
    },
    proof: ['homelab', 'call-center'],
  },
];
