export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: { backendOrigin: process.env.BACKEND_ORIGIN || 'http://127.0.0.1:30678' },
  typescript: { strict: true, typeCheck: true },
  devServer: { port: 30679 },
})
