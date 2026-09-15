/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import { createVuetify } from 'vuetify'

import 'vuetify/styles'

/*********************************************
 * 📂 Category: Composables / Plugins
 * 🔧 Defines: Vuetify plugin 與主題設定
 *********************************************/
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'pixelOffice',
      themes: {
        pixelOffice: {
          dark: true,
          colors: {
            appBackground: '#10141d',
            surface: '#1b212c',
            surfaceAlt: '#222c39',
            border: '#384453',
            text: '#e8edf5',
            textMuted: '#95a3b5',
            accent: '#5cae88',
            accentText: '#102018',
            mapSurface: '#6b8c84',
            mapBorder: '#d3c4a8',
            mapGrid: '#ffffff',
            deskSurface: '#b68b62',
            deskBorder: '#694d39',
            deskText: '#201b19',
            roomSurface: '#bac2bc',
            roomBorder: '#6e7771',
            roomText: '#20262d',
            success: '#64c786',
            info: '#5d9ee8',
            warning: '#f0d58a',
            inputSurface: '#10151e',
            taskSurface: '#273343',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
