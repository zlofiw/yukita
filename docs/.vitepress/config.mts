import { defineConfig } from 'vitepress';

function enNav() {
  return [
    { text: 'Getting Started', link: '/getting-started' },
    { text: 'Nodes', link: '/nodes' },
    { text: 'Players', link: '/players' },
    { text: 'REST', link: '/rest' },
    { text: 'Plugins', link: '/plugins' },
    { text: 'Connectors', link: '/connectors' },
    { text: 'Gateway', link: '/gateway' },
    { text: 'Recipes', link: '/recipes' }
  ];
}

function enSidebar() {
  return [
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
        { text: 'Recipes', link: '/recipes' }
      ]
    }
  ];
}

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
        nav: enNav(),
        sidebar: enSidebar()
      }
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      themeConfig: {
        nav: enNav().map((item) => ({ ...item, link: `/ru${item.link}` })),
        sidebar: enSidebar().map((group) => ({
          ...group,
          items: group.items.map((item) => ({ ...item, link: `/ru${item.link}` }))
        }))
      }
    },
    uk: {
      label: 'Українська',
      lang: 'uk',
      themeConfig: {
        nav: enNav().map((item) => ({ ...item, link: `/uk${item.link}` })),
        sidebar: enSidebar().map((group) => ({
          ...group,
          items: group.items.map((item) => ({ ...item, link: `/uk${item.link}` }))
        }))
      }
    },
    kk: {
      label: 'Қазақша',
      lang: 'kk',
      themeConfig: {
        nav: enNav().map((item) => ({ ...item, link: `/kk${item.link}` })),
        sidebar: enSidebar().map((group) => ({
          ...group,
          items: group.items.map((item) => ({ ...item, link: `/kk${item.link}` }))
        }))
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
