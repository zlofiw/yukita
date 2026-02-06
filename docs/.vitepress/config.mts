import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'YukiTa',
  description: 'TypeScript-first Lavalink toolkit for Node.js',
  lang: 'en-US',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f172a' }]
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'Plugin Guide', link: '/guides/plugin-development' },
      { text: 'Release Guide', link: '/guides/release' },
      {
        text: 'Reference',
        items: [
          { text: 'Architecture', link: '/reference/architecture' },
          { text: 'Events', link: '/reference/events' },
          { text: 'Error Codes', link: '/reference/error-codes' },
          { text: 'Gateway Protocol', link: '/reference/gateway-protocol' },
          { text: 'Plugin Hooks', link: '/reference/plugins' }
        ]
      }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'Plugin Development', link: '/guides/plugin-development' },
          { text: 'Release Guide', link: '/guides/release' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Architecture', link: '/reference/architecture' },
          { text: 'Events', link: '/reference/events' },
          { text: 'Error Codes', link: '/reference/error-codes' },
          { text: 'Gateway Protocol', link: '/reference/gateway-protocol' },
          { text: 'Plugin Hooks', link: '/reference/plugins' }
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: 'On this page'
    },
    footer: {
      message: 'Released under MIT License',
      copyright: 'Copyright 2026 YukiTa'
    }
  }
});
