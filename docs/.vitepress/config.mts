import { defineConfig } from 'vitepress';

const navEn = [
  { text: 'Getting Started', link: '/getting-started' },
  { text: 'Nodes', link: '/nodes' },
  { text: 'Players', link: '/players' },
  { text: 'REST', link: '/rest' },
  { text: 'Plugins', link: '/plugins' },
  { text: 'Connectors', link: '/connectors' },
  { text: 'Gateway', link: '/gateway' },
  { text: 'API', link: '/api/' }
];

const sidebarEn = [
  {
    text: 'Guide',
    items: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Nodes & Load Balancing', link: '/nodes' },
      { text: 'Players & Queue', link: '/players' },
      { text: 'REST & LavalinkResponse', link: '/rest' },
      { text: 'Plugins', link: '/plugins' },
      { text: 'Connectors (Discord.js)', link: '/connectors' },
      { text: 'WebSocket Gateway', link: '/gateway' },
      { text: 'Recipes', link: '/recipes' },
      { text: 'Examples', link: '/examples' },
      { text: 'Glossary', link: '/glossary' }
    ]
  },
  {
    text: 'Reference',
    items: [
      { text: 'API Reference', link: '/api/' }
    ]
  }
];

const navRu = [
  { text: 'Начало', link: '/ru/getting-started' },
  { text: 'Ноды', link: '/ru/nodes' },
  { text: 'Плееры', link: '/ru/players' },
  { text: 'REST', link: '/ru/rest' },
  { text: 'Плагины', link: '/ru/plugins' },
  { text: 'Коннекторы', link: '/ru/connectors' },
  { text: 'Gateway', link: '/ru/gateway' },
  { text: 'API', link: '/ru/api' }
];

const sidebarRu = [
  {
    text: 'Гайд',
    items: [
      { text: 'Начало', link: '/ru/getting-started' },
      { text: 'Ноды и балансировка', link: '/ru/nodes' },
      { text: 'Плееры и очередь', link: '/ru/players' },
      { text: 'REST и LavalinkResponse', link: '/ru/rest' },
      { text: 'Плагины', link: '/ru/plugins' },
      { text: 'Коннекторы (Discord.js)', link: '/ru/connectors' },
      { text: 'WebSocket Gateway', link: '/ru/gateway' },
      { text: 'Рецепты', link: '/ru/recipes' },
      { text: 'Примеры', link: '/ru/examples' },
      { text: 'Глоссарий', link: '/ru/glossary' }
    ]
  },
  {
    text: 'Справка',
    items: [
      { text: 'API Reference', link: '/ru/api' }
    ]
  }
];

const navUk = [
  { text: 'Початок', link: '/uk/getting-started' },
  { text: 'Ноди', link: '/uk/nodes' },
  { text: 'Плеєри', link: '/uk/players' },
  { text: 'REST', link: '/uk/rest' },
  { text: 'Плагіни', link: '/uk/plugins' },
  { text: 'Конектори', link: '/uk/connectors' },
  { text: 'Gateway', link: '/uk/gateway' },
  { text: 'API', link: '/uk/api' }
];

const sidebarUk = [
  {
    text: 'Гайд',
    items: [
      { text: 'Початок', link: '/uk/getting-started' },
      { text: 'Ноди та балансування', link: '/uk/nodes' },
      { text: 'Плеєри та черга', link: '/uk/players' },
      { text: 'REST та LavalinkResponse', link: '/uk/rest' },
      { text: 'Плагіни', link: '/uk/plugins' },
      { text: 'Конектори (Discord.js)', link: '/uk/connectors' },
      { text: 'WebSocket Gateway', link: '/uk/gateway' },
      { text: 'Рецепти', link: '/uk/recipes' },
      { text: 'Приклади', link: '/uk/examples' },
      { text: 'Глосарій', link: '/uk/glossary' }
    ]
  },
  {
    text: 'Довідка',
    items: [
      { text: 'API Reference', link: '/uk/api' }
    ]
  }
];

const navKk = [
  { text: 'Бастау', link: '/kk/getting-started' },
  { text: 'Түйіндер', link: '/kk/nodes' },
  { text: 'Плеерлер', link: '/kk/players' },
  { text: 'REST', link: '/kk/rest' },
  { text: 'Плагиндер', link: '/kk/plugins' },
  { text: 'Коннекторлар', link: '/kk/connectors' },
  { text: 'Gateway', link: '/kk/gateway' },
  { text: 'API', link: '/kk/api' }
];

const sidebarKk = [
  {
    text: 'Нұсқаулық',
    items: [
      { text: 'Бастау', link: '/kk/getting-started' },
      { text: 'Түйіндер және баланс', link: '/kk/nodes' },
      { text: 'Плеерлер және кезек', link: '/kk/players' },
      { text: 'REST және LavalinkResponse', link: '/kk/rest' },
      { text: 'Плагиндер', link: '/kk/plugins' },
      { text: 'Коннекторлар (Discord.js)', link: '/kk/connectors' },
      { text: 'WebSocket Gateway', link: '/kk/gateway' },
      { text: 'Рецепттер', link: '/kk/recipes' },
      { text: 'Мысалдар', link: '/kk/examples' },
      { text: 'Глоссарий', link: '/kk/glossary' }
    ]
  },
  {
    text: 'Анықтама',
    items: [
      { text: 'API Reference', link: '/kk/api' }
    ]
  }
];

export default defineConfig({
  title: 'YukitaSan',
  description: 'TypeScript-first Lavalink v4 client library for Node.js',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  head: [['meta', { name: 'theme-color', content: '#0f172a' }]],
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: navEn,
        sidebar: sidebarEn
      }
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      themeConfig: {
        nav: navRu,
        sidebar: sidebarRu
      }
    },
    uk: {
      label: 'Українська',
      lang: 'uk',
      themeConfig: {
        nav: navUk,
        sidebar: sidebarUk
      }
    },
    kk: {
      label: 'Қазақша',
      lang: 'kk',
      themeConfig: {
        nav: navKk,
        sidebar: sidebarKk
      }
    }
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: 'On this page'
    },
    footer: {
      message: 'Released under MIT License',
      copyright: 'Copyright 2026 YukitaSan'
    }
  }
});
