export default defineNuxtConfig({
  extends: ['./layers/base', './layers/office', './layers/model-settings'],
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: { public: { apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:30678' } },
  typescript: { strict: true, typeCheck: true },
  devServer: { port: 30679 },
})
