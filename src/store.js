import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const INITIAL_STATE = {
  user: {},
  darkTheme: false,
  confirmDialog: {
    shown: false,
    title: null,
    body: null,
    response: null,
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
  },

  mutations: {
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
  },
})
