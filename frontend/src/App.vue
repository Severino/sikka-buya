<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
import ButtonGroup from "./components/forms/ButtonGroup.vue";
export default {
  components: { ButtonGroup },
  name: "App",
  data: function () {
    return {
      version: "",
      language: "de",
    };
  },
  created: function () {
    this.version = require("../package.json").version;
  },
  mounted: function () {
    const lang = window.localStorage.getItem("language", this.$i18n.locale);
    if (lang) {
      this.languageChanged(lang);
    }else{
      this.languageChanged("de");
    }
  },
  methods: {
    languageChanged: function (lang) {
      this.language = lang;
      this.$i18n.locale = lang;
      window.localStorage.setItem("language", this.$i18n.locale);
    },
    goHome: function () {
      if (this.$router.route != "/") this.$router.push("/");
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
  font-family: 'Cairo', sans-serif;
  font-size: 16px;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.content-wrapper {
  width: 1080px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 30px;
  box-sizing: border-box;
}


h1 {
  font-weight: bold;
  font-size: 3rem;
  margin: 0;
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
    margin-bottom: 0;
  }
}


#app-name {
  color: $primary-color;
  margin-right: $padding;
  text-transform: none;
  font-weight: 800;

  @include interactive();
}

.property-group{
  margin-bottom: 1rem;
}


#app-name:after {
  content: "|";
  color: white;
  margin: 0 20px;
}


select,
.button,
input,
button {
  @include input;
}

button[type="submit"] {
  color: white;
  background-color: $primary-color;

  &:hover {
    background-color: darken($color: $primary-color, $amount: 5);
  }
}

.button,
button {
  text-transform: capitalize;
  @include input;
  @include interactive();
}

.version {
  font-size: 0.5em;
  opacity: 0.5;
  padding: 10px;
}

label {
  font-weight: bold;
  // color: $primary-color;
  font-size: $regular-font;
  display: block;

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