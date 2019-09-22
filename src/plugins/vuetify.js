import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        'primary': '#8bc34a',
        'secondary': '#b9f6ca',
        'accent': '#ffd600',
        'error': '#FF5252',
        'info': '#2196F3',
        'success': '#2e7d32',
        'warning': '#ffab40',
      },
      dark: {
        'primary': '#4caf50',
        'secondary': '#1b5e20',
        'accent': '#ffab40',
        'error': '#FF5252',
        'info': '#2196F3',
        'success': '#8bc34a',
        'warning': '#ffd600',
      },
    },
  },
})
