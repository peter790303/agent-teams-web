export default defineNuxtConfig({
  extends: ['./layers/base', './layers/domain', './layers/office', './layers/model-settings'],
  modules: ['@nuxt/eslint'],
  devtools: { enabled: false },
  plugins: ['./layers/base/plugins/vuetify.ts'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: { public: { apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:30678' } },
  typescript: { strict: true, typeCheck: true },
  devServer: { port: 30679 },
})
