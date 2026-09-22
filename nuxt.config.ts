// Category: Methods
// Defines: Nuxt 應用程式設定
export default defineNuxtConfig({
  extends: ['./layers/base', './layers/domain', './layers/office', './layers/model-settings'],
  modules: ['@nuxt/eslint'],
  devtools: { enabled: false },
  css: ['@mdi/font/css/materialdesignicons.css', '~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:30678',
      nestApiKey: process.env.NEST_API_KEY ?? '',
    },
  },
  typescript: { strict: true, typeCheck: true },
  devServer: { port: 30679 },
})
