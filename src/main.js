import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { firestorePlugin } from 'vuefire'

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

Vue.config.productionTip = false
Vue.prototype.$firebase = firebase

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
