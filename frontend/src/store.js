import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

let version = require("../../package.json").version;

const store = new Vuex.Store({
  state: {
    user: null,
    availableLanguages: ["de", "en"],
    language: "de",
    showLoginForm: false,
    showConfirmation: true,
    version
  },
  mutations: {
    login(state, user) {
      state.user = user
    },
    logout(state) {
      state.user = null
    },
    showLoginForm(state) {
      state.showLoginForm = true
    },
    closeLoginForm(state) {
      state.showLoginForm = false
    }, increment(state) {
      state.test++
    },
    changeLanguage(state, lang) {
      if (state.availableLanguages.indexOf(lang) != -1)
        state = lang
      else console.error(`Requested language is not supported: ${lang}.`)
    }
  }, getters: {
    loggedIn: state => {
      return !!state.user
    }
  }
})


export default store