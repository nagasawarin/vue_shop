import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'plugins/elements'
import 'assets/css/index.css'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.component('table-tree', ZkTable)