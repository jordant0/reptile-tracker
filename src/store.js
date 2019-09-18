import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const INITIAL_STATE = {
  user: {},
  darkTheme: false,
}

export default new Vuex.Store({
  state: {
    ...INITIAL_STATE,
  },

  getters: {
    uuid: state => {
      return state.user.uid;
    },
  },

  mutations: {
    updateDarkTheme(state, payload) {
      state.darkTheme = payload;
    },

    updateUser(state, payload) {
      state.user = payload || {};
    },
  },
})
