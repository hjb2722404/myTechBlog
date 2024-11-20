// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@element-plus/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt'
  ],
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/styles/theme.css'
  ],
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue']
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3
      }
    }
  },
  elementPlus: {
    importStyle: 'css',
    themes: ['dark']
  },
  app: {
    head: {
      title: '技术博客',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '前端技术博客 - 分享技术文章和管理心得' }
      ],
      link: [
        { 
          rel: 'preconnect', 
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  }
})