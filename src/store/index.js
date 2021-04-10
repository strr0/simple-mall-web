import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    routes: [],
    menuId: null
  },
  mutations: {
    login(state, user) {
      state.user = user
    },
    logout(state) {
      state.user = null,
      state.routes = [],
      state.menuId = null
    },
    initMenu(state, routes) {
      state.routes = routes
    },
    selectMenu(state, menuId) {
      state.menuId = menuId
    }
  },
  actions: {
  },
  modules: {
  }
})
