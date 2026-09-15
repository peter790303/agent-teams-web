/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import vuetify from 'vite-plugin-vuetify'

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: Nuxt layer 設定
 *********************************************/
export default defineNuxtConfig({
  vite: {
    plugins: [vuetify({ autoImport: true })],
    ssr: {
      noExternal: ['vuetify'],
    },
  },
})
