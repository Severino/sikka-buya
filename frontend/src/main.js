import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import i18n from './i18n/i18n'
import store from "./store"
import capitalize from 'capitalize';
import Settings from './settings'

/**Initializes the settings on the first page visit. */
if (Settings.init(window) > 0) {
  console.warn("All default settings were created.")
}

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
