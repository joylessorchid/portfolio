import type { L10n } from '../i18n/ui';

export interface SkillGroup {
  title: L10n;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    title: { ru: 'AI и голос', en: 'AI & voice' },
    items: ['OpenRouter', 'Gemini', 'YandexGPT', 'DeepSeek', 'Claude Code', 'LiveKit', 'Yandex SpeechKit', 'ElevenLabs', 'Whisper', 'Silero VAD'],
  },
  {
    title: { ru: 'Бэкенд и веб', en: 'Backend & web' },
    items: ['Python', 'FastAPI', 'TypeScript', 'NestJS', 'React', 'MedusaJS', 'Astro', 'PostgreSQL', 'MariaDB', 'Redis', 'RabbitMQ'],
  },
  {
    title: { ru: 'Инфраструктура', en: 'Infrastructure' },
    items: ['Linux', 'Docker', 'Docker Compose', 'Proxmox VE', 'LXC', 'k3s', 'Nginx', 'Caddy', 'NPMplus', 'Traefik', 'Cloudflare'],
  },
  {
    title: { ru: 'Автоматизация и интеграции', en: 'Automation & integrations' },
    items: ['n8n', 'Telegram Bot API', 'Telegram Mini Apps', 'Bitrix24', 'LeadVertex', 'Green-API', 'YouTube API'],
  },
  {
    title: { ru: 'Мониторинг', en: 'Observability' },
    items: ['Prometheus', 'Grafana', 'node_exporter', 'pve-exporter', 'Telegram-алерты'],
  },
  {
    title: { ru: 'Сети и телефония', en: 'Networking & telephony' },
    items: ['DNS', 'Technitium DNS', 'TLS / Let’s Encrypt', 'IPv6', 'Xray-core', 'Asterisk', 'FreePBX', 'SIP'],
  },
  {
    title: { ru: 'Облака', en: 'Cloud' },
    items: ['Yandex Cloud', 'Selectel', 'Timeweb Cloud', 'AWS', 'Google Cloud', 'Azure', 'Hostinger', 'DigitalOcean'],
  },
  {
    title: { ru: 'Дизайн', en: 'Design' },
    items: ['Figma', 'Photoshop', 'Premiere Pro'],
  },
];

/** Переводы отдельных пунктов, где название зависит от языка. */
export const skillLabel = (item: string, lang: 'ru' | 'en') =>
  lang === 'en' && item === 'Telegram-алерты' ? 'Telegram alerts' : item;
