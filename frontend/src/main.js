import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import i18n from './i18n/i18n'
import store from "./store"
import capitalize from 'capitalize';



Vue.config.productionTip = false

Vue.prototype.$utils = {
  capitalize
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
