import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

let version = require("../package.json").version;

const store = new Vuex.Store({
  state: {
    user: null,
    showLoginForm: false,
    version
  },
  mutations: {
    login(state, user) {
      state.user = user
    },
    logout(state){
      state.user = null
    },
    showLoginForm(state) {
      state.showLoginForm = true
    },
    closeLoginForm(state) {
      state.showLoginForm = false
    }, increment(state) {
      state.test++
    }
  }
})


export default store