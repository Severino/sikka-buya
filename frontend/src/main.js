import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import I18n from './i18n/i18n'
import store from "./store"
import capitalize from 'capitalize';
import Settings from './settings'
import { ConfigMixin } from './config'

async function main() {
  const i18n = await I18n.load()


  /**Initializes the settings on the first page visit. */
  if (Settings.init(window) > 0) {
    console.warn("All default settings were created.")
  }

  Vue.config.productionTip = false

  Vue.prototype.$utils = {
    capitalize
  }

  Vue.mixin(ConfigMixin)
  Vue.mixin({
    methods: {
      log(...args) {
        console.log(...args)
      }
    }
  })

  registerGlobalComponents()

  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
}

main().catch(console.error)

function registerGlobalComponents(){
  Vue.component('check', () => import(/* webpackChunkName: "v-icon" */ "vue-material-design-icons/Check"))
  Vue.component('check-emphasis', () => import(/* webpackChunkName: "v-icon" */ "vue-material-design-icons/CheckBold"))

}