<template>
  <div id="app">
    <modal :active="loginActive" @close="closeLoginForm">
      <login-form @login="closeLoginForm" />
      {{ getCount }}
    </modal>
    <router-view></router-view>
  </div>
</template>

<script>
import LoginForm from './components/auth/LoginForm.vue';
import ButtonGroup from './components/forms/ButtonGroup.vue';
import Modal from './components/layout/Modal.vue';
import Auth from './utils/Auth';
import PopupHandler from './popup';
import Query from './database/query';

export default {
  components: { ButtonGroup, LoginForm, Modal },
  name: 'App',
  data: function () {
    return {
      popupHandler: null,
      language: 'de',
    };
  },
  created: async function () {
    let user = await Auth.init();
    this.$store.commit('login', user);

    this.popupHandler = new PopupHandler(this);
    this.popupHandler.init(document.body);
  },
  beforeDestroy: function () {
    this.popupHandler.cleanup();
  },
  mounted: function () {
    const lang = window.localStorage.getItem('language', this.$i18n.locale);
    if (lang) {
      this.languageChanged(lang);
    } else {
      this.languageChanged('de');
    }

    // Query.raw('environment')
    //   .then((env) => {
    //     window.sikkaEnvironment = env;
    //   })
    //   .catch((e) => (window.sikkaEnvironment = null));
  },
  methods: {
    languageChanged: function (lang) {
      this.language = lang;
      this.$i18n.locale = lang;
      window.localStorage.setItem('language', this.$i18n.locale);
    },
    goHome: function () {
      if (this.$router.route != '/') this.$router.push('/');
    },
    closeLoginForm: function () {
      this.$store.commit('closeLoginForm');
      this.$store.commit('increment');
    },
    plusOne: function () {
      this.$store.commit('increment');
    },
  },
  computed: {
    loginActive() {
      return this.$store.state.showLoginForm;
    },
    getCount() {
      return this.$store.state.test;
    },
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  min-height: 100%;
  background-color: $background-color;
  color: $text-color;
}
body {
  font-family: $font;
  font-size: $regular-font;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

button,
input {
  font-family: $font;
  font-size: $regular-font;
}

input::placeholder {
  color: $light-gray;
  font-style: italic;
}

input[type='color'] {
  flex: unset !important;
  display: block;
  padding: 0;
  min-width: 200px;
  min-height: 40px;
}

.emph {
  color: $primary-color;
  font-weight: bold;
}

.content-wrapper {
  width: 1080px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 30px;
  box-sizing: border-box;
}

.center-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  font-weight: bold;
  font-size: 3rem;
}

.subtitle {
  display: block;
  color: $gray;
  font-size: $regular-font;
  font-weight: bold;
}

.hero {
  width: 100%;
  height: 100%;
}

section {
  // margin-top: 5em;

  h3 {
    font-size: 1.5em;
    font-weight: bold;
  }
}

#app-name {
  color: $primary-color;
  margin-right: $padding;
  text-transform: none;
  font-weight: 800;

  @include interactive();
}

.property-group {
  margin-bottom: 1rem;
}

#app-name:after {
  content: '|';
  color: white;
  margin: 0 20px;
}

button[disabled] {
  background-color: gray;
}

select,
input,
button {
  @include input;
  box-sizing: border-box;
}

button[type='submit'] {
  color: white;
  background-color: $primary-color;

  &:hover {
    background-color: darken($color: $primary-color, $amount: 5);
  }
}

.button,
button {
  display: block;
  @include input;
  @include interactive();
}

.button.ghost-btn {
  position: absolute;
  right: 0;
  border: none;
  border-radius: 0;
  background-color: rgba($gray, 0);
  color: $gray;

  &:hover {
    background-color: rgba($gray, 0.5);
  }
}

.button-list,
li {
  &:not(:last-child-of-type) > .button {
    border-bottom: none;
  }

  > .button {
    border-radius: 0;
  }
}

.transparent-button {
  background-color: transparent;
  border: none;

  &:hover {
    background-color: rgba(#000000, 0.1);
  }
}

.label,
label {
  font-weight: bold;
  font-size: $regular-font;
  display: block;
}

label {
  @include interactive();
}

.button-bar {
  display: flex;

  > * {
    flex: 1;
  }

  > *:not(:last-child) {
    margin-right: 10px;
  }
}

.top-header {
  // color: white;
  // background-color: rgb(75, 75, 75);

  .button-group {
    input:checked + label {
      background-color: transparent;
      border-bottom: 2px solid white;

      border-top-right-radius: unset;
      border-top-left-radius: unset;
      border-bottom-right-radius: unset;
      border-bottom-left-radius: unset;
    }

    label {
      background-color: transparent;
      border-radius: 0;
      border: none;
      padding: $padding;
    }
  }
}

a {
  text-decoration: none;

  &:visited {
    color: unset;
  }
}

.icon-button {
  text-transform: capitalize;
  display: flex;
  align-items: center;

  :first-child {
    margin-right: $padding;
  }
}

.button-list {
  > * {
    margin-bottom: $padding;
  }
}

.error {
  font-size: 0.8rem;
  padding: 20px;
  background-color: rgb(255, 92, 92);
  border: 1px solid rgb(192, 68, 68);
}

.material-design-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 22px;
  // height: 22px;
}

input:read-only {
  background-color: whitesmoke;
}

// section {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
// .box {
//   max-width: 100%;
//   background-color: $white;
//   @include box-padding($big-padding);
// }
</style>
