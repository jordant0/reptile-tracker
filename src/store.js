import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'

Vue.use(Vuex)

const INITIAL_STATE = {
  user: {},
  darkTheme: false,
  userConfig: {},
  userConfigLoaded: false,
  animalList: [],
  animalListLoaded: false,
  confirmDialog: {
    shown: false,
    title: null,
    body: null,
    response: null,
  },
  notification: {
    shown: false,
    color: null,
    text: null,
  },
}

export default new Vuex.Store({
  state: {
    ...INITIAL_STATE,
  },

  getters: {
    uuid: state => {
      return state.user.uid
    },

    animalData: state => animalId => {
      return state.animalList.find(animal => animal.id === animalId)
    },
  },

  mutations: {
    ...vuexfireMutations,

    updateDarkTheme(state, payload) {
      state.darkTheme = payload
    },

    updateUser(state, payload) {
      state.user = payload || {}
    },

    showConfirmDialog(state, payload) {
      state.confirmDialog = {
        shown: true,
        title: payload.title,
        body: payload.body,
        response: null,
      }
    },

    confirmDialogResponse(state, payload) {
      state.confirmDialog = {
        ...state.confirmDialog,
        shown: false,
        response: payload,
      }
    },

    showNotification(state, payload) {
      state.notification = {
        shown: true,
        color: payload.color,
        text: payload.text,
      }
    },

    setNotificationShown(state, value) {
      state.notification.shown = value
    },

    userConfigLoadFinish(state) {
      state.userConfigLoaded = true
    },

    animalListLoadFinish(state) {
      state.animalListLoaded = true
    },
  },

  actions: {
    bindAnimalList: firestoreAction(
      ({ bindFirestoreRef, commit }, ref) => {
        bindFirestoreRef('animalList', ref)
          .then((doc) => {
            commit('animalListLoadFinish')
          })
      }
    ),

    bindUserConfig: firestoreAction(
      ({ bindFirestoreRef, commit }, ref) => {
        bindFirestoreRef('userConfig', ref)
          .then((doc) => {
            commit('userConfigLoadFinish')
          })
      }
    ),
  },
})
