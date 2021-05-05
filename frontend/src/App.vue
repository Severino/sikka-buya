<template>
  <div id="app">
    <header class="top-header">
      <div class="content-wrapper">
        <div class="top-navigation">
          <img src="@/assets/images/sikka-buya.png" alt="">
        </div>
      </div>
    </header>
    <main class="content-wrapper">
      <router-view></router-view>
    </main>
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
@import "./scss/_import.scss";



html,
body {
  margin: 0;
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
  margin: 20px 100px;
}


h1 {
  font-weight: bold;
  font-size: 3rem;
}


section {
  // margin-top: 5em;

  h3 {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 0;
  }
}

.label{
  font-weight: bold;
  margin-bottom: 0.5rem;
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
  font-size: $large-font;
  display: block;
  margin-bottom: 10px;

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

header {
  padding: 0 $padding;
  display: flex;
  align-items: center;

  nav {
    margin-left: auto;
  }
}

.top-navigation {
  display: flex;
  align-items: center;
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

</style>
