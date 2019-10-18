import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
// import './registerServiceWorker'
import vuetify from './plugins/vuetify'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { firestorePlugin } from 'vuefire'

import 'cropperjs/dist/cropper.css'

import VCalendar from 'v-calendar'

window.OneSignal = window.OneSignal || []
window.OneSignal.push(() => {
  window.OneSignal.init({
    appId: process.env.VUE_APP_ONESIGNAL,
    allowLocalhostAsSecureOrigin: process.env.NODE_ENV !== 'production',
  })
})

Vue.use(firestorePlugin)

const config = {
  apiKey: 'AIzaSyB7dQFd7jauzCuYr5_VQStXitk4dQ11Ypg',
  authDomain: 'snek-tracker.firebaseapp.com',
  databaseURL: 'https://snek-tracker.firebaseio.com',
  projectId: 'snek-tracker',
  storageBucket: 'snek-tracker.appspot.com',
  messagingSenderId: '439027452183',
  appId: '1:439027452183:web:f2c3786b856953a2',
}
firebase.initializeApp(config)

firebase.firestore().enablePersistence()

Vue.config.productionTip = false
Vue.prototype.$firebase = firebase

Vue.use(VCalendar, {
  componentPrefix: 'v2',
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
