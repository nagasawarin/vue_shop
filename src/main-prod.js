import App from './App.vue'
import router from './router'
import store from './store'
import 'assets/css/index.css'
import ZkTable from 'vue-table-with-tree-grid'
import Breadcrumb from 'components/common/Breadcrumb'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.component('table-tree', ZkTable)
Vue.component('breadcrumb', Breadcrumb)
Vue.use(VueQuillEditor)


Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});