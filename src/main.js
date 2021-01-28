import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'assets/css/global.css'
import '@/plugins/elements.js'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/fonts/iconfont.css'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
