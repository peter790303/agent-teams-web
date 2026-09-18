/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import 'vuetify/styles'

/*********************************************
 * 📂 Category: Composables / Plugins
 * 🔧 Defines: Vuetify plugin 與主題設定
 *********************************************/
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    // SSR 取不到 viewport 寬度：hydration 先沿用伺服端 display 值，app:suspense:resolve 後才更新為實際寬度，避免 class 不一致
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    defaults: {
      VSelect: {
        variant: 'outlined',
        color: 'accent',
        menuIcon: 'mdi-chevron-down',
      },
      VBtn: {
        color: 'accent',
        variant: 'flat',
      },
      VChip: {
        color: 'primary',
        variant: 'flat',
      },
    },
    theme: {
      defaultTheme: 'pixelOffice',
      themes: {
        pixelOffice: {
          dark: true,
          colors: {
            background: '#10141d',
            surface: '#1b212c',
            primary: '#5cae88',
            'on-background': '#e8edf5',
            'on-surface': '#e8edf5',
            'on-primary': '#102018',
            appBackground: '#10141d',
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
