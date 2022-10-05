<template>
  <div id="app" ref="app">
    <modal :active="$store.state.showLoginForm" @close="closeLoginForm">
      <login-form @login="closeLoginForm" />
      {{ getCount }}
    </modal>

    <router-view></router-view>

    <div class="error-popup error" :class="{ show: $store.getters.hasErrors }">
      <div
        class="error-message"
        v-for="(error, idx) of $store.getters.errors"
        :key="`error-${idx}`"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from './components/auth/LoginForm.vue';
import ButtonGroup from './components/forms/ButtonGroup.vue';
import Modal from './components/layout/Modal.vue';
import Auth from './utils/Auth';
import PopupHandler from './popup';

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
    try {
      let user = await Auth.init();
      this.$store.commit('login', user);
    } catch (e) {
      //Fail silently
      console.log('Not authenticated');
    }

    this.popupHandler = new PopupHandler(this);
    this.popupHandler.init(document.body);
  },
  beforeDestroy: function () {
    this.popupHandler.cleanup();
  },
  mounted: function () {
    /**
     * Disables the default zoom behaviour of the browser.
     */
    this.$refs.app.addEventListener('wheel', (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    });

    let lang;
    try {
      lang = window.localStorage.getItem('language', this.$i18n.locale);
    } catch (e) {
      console.warn(e);
    }

    if (lang) {
      this.languageChanged(lang);
    } else {
      this.languageChanged('de');
    }
  },
  methods: {
    languageChanged: function (lang) {
      this.language = lang;
      this.$i18n.locale = lang;
      try {
        window.localStorage.setItem('language', this.$i18n.locale);
      } catch (e) {
        console.warn(e);
      }
    },
    goHome: function () {
      if (this.$router.route != '/') this.$router.push('/');
    },
    closeLoginForm: function () {
      this.$store.commit('closeLoginForm');
      this.$store.commit('increment');
    },
  },
  computed: {
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

p {
  line-height: 1.5rem;
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

.padding-box {
  padding: $padding;
}

@include allHeadings {
  font-family: 'Arimo';
}

h1 {
  font-weight: bold;
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
  // font-weight: bold;
  margin-block-end: 1rem;
}

h6 {
  font-size: 1rem;
  color: $gray;

  margin-block-start: 1.5rem;
  margin-block-end: 1rem;
}

.subtitle {
  display: block;
  color: $black;
  border-color: $black !important;
  font-size: $regular-font;
  // font-weight: bold;
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
  display: flex;
  align-items: center;
  justify-content: center;
  @include input;
  @include interactive();

  border-radius: 3px;

  > .material-design-icon:not(:last-child) {
    width: 1.3em;
    margin-right: $padding;
  }

  &.rounded {
    border-radius: 0.5em;
  }

  &.small-button {
    font-size: $small-font;
    padding: 0 $small-padding * 2;
  }

  &[disabled] {
    color: $light-gray;

    background-color: $gray;
    cursor: not-allowed;
    &:hover,
    &:active {
      color: $light-gray;
      background-color: $gray;
    }
  }
}

.disabled {
  color: $light-gray;
}

.button.small-button {
  font-size: $small-font;
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
  color: $gray;
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
  @include linkStyle();
}

.icon-button {
  text-transform: capitalize;
  display: flex;
  align-items: center;

  :first-child:not(:last-child) {
    margin-right: $padding;
  }
}

.tooltip-container {
  position: relative;
}

.div-icon-button {
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: $dark-white;
  }
}

.div-icon-button + .tooltip {
  opacity: 0;
  position: absolute;
  top: -5px;
  left: 50%;
  min-width: 150px;
  transform: translate(-50%, -100%);
  padding: $small-padding;
  border-radius: $small-border-radius;
  background-color: white;
  transition: all $transition-time;
}

.div-icon-button:hover + .tooltip {
  opacity: 1;
}

.div-icon {
  background-color: $white;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  border-radius: 10px;
}

.button-list {
  > * {
    margin-bottom: $padding;
  }
}

.error {
  font-weight: bold;
  color: $red;
}

.material-design-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid {
  display: grid;
  gap: $padding;
}

.col-1-2 {
  grid-template-columns: 1fr 2fr;
}

@mixin grid-even-columns {
  @for $i from 2 through 6 {
    .col-#{$i} {
      grid-template-columns: repeat($i, 1fr);
    }
  }
}

@include grid-even-columns();

.center {
  align-self: center;
}

.error-popup.show {
  bottom: $padding;
  transform: translateX(-50%) translateY(0);
}

.error-popup {
  position: fixed;
  width: 720px;
  bottom: 0;

  background-color: $red;
  color: $white;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  padding: $padding;
  border-radius: $small-border-radius;

  transition: all $transition-time;

  > * {
    margin-top: $big-padding;
    margin-bottom: $big-padding;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.hint {
  // font-weight: bold;
  font-style: italic;
  color: $light-gray;
}

.note {
  display: block;
  font-size: $small-font;
  color: $primary-color;
  font-style: italic;
}

.map-page .top-right-toobar {
  margin: $padding;
  display: inline-block;
}

.popup-content {
  padding-bottom: 10px;
}

.grayedOut {
  opacity: 0.3;
  background-color: gray;
}

.unavailable {
  color: gray;
}
.gray-heading {
  color: $gray;
  margin: 0;
}

.underlined-header {
  padding: $padding $big-padding;
  border-bottom: $border;
}

.black {
  color: $black;
}
</style>
