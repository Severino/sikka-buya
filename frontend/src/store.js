import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

let version = require("../package.json").version;

const store = new Vuex.Store({
    state: {
      user: null,
      version
    },
    mutations: {
      login(state, user){
        console.log(user)
          state.user = user
      }
    }
  })
  

export default store