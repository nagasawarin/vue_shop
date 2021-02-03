import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuName: {
      submenuName: "用户管理",
      menuitemName: "用户列表"
    }
  },
  mutations: {
    menuNameChange(state, menuName) {
      state.menuName = menuName;
    }
  }
})
