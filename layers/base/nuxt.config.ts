import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  vite: {
    plugins: [vuetify({ autoImport: true })],
    ssr: {
      noExternal: ['vuetify'],
    },
  },
})
