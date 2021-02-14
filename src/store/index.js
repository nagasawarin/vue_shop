import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuName: {
      submenuName: "",
      menuitemName: ""
    }
  },
  mutations: {
    menuNameChange(state, menuName) {
      state.menuName = menuName;
    }
  }
})
