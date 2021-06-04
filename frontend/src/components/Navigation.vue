<template>
  <header>
    <div class="content-wrapper">
      <div class="brand">
        <router-link :to="{ name: 'Home' }">
          <img src="@/assets/images/sikka-buya.png" alt="" />
        </router-link>
      </div>
      <div class="nav-menu" :class="{ active: active }">
        <nav>
          <ul>
            <li v-for="(item, index) in items" :key="`nav-item-${index}`">
              <router-link :to="item.target">{{ item.name }}</router-link>
            </li>
          </ul>
        </nav>
        <div class="lang-version-grp">
          <span class="version">{{ version }}</span>
          <div class="languages">DE</div>
        </div>
        <div v-if="user" class="user">
          <router-link :to="{ name: 'Editor' }">
            <Pencil />
          </router-link>
          <div @click="logout">{{ $t("system.logout") }}</div>
        </div>
        <div class="nav-toggle" @click="toggleMenu()">
          <Menu v-if="active" />
          <Close v-else />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import Pencil from "vue-material-design-icons/Pencil";

import Menu from "vue-material-design-icons/Menu";
import Close from "vue-material-design-icons/Close";

import Auth from "../utils/Auth";

export default {
  name: "Navigation",
  components: {
    Pencil,
    Menu,
    Close,
  },
  data: function () {
    return {
      active: false,
      items: [
        // { name: "Home", target: "undefined" },
        { name: "Karte", target: { name: "MapPage" } },
        { name: "Typekatalog", target: { name: "Catalog" }, auth: true },
      ],
    };
  },
  methods: {
    toggleMenu: function () {
      this.active = !this.active;
    },
    logout: function () {
      Auth.logout();
      this.$store.commit("logout")
      this.$router.push({ name: "Home" });
    },
  },
  created: function(){
    console.log("NAVIGATION CREATED")
  },
  ////TODO: Remove if this was not necessary.
  //// User is now stored in VUEX.
// watch: {
//     $route(to, from) {
//       this.$store.commit("login", this.user);
//     },
//   },
  computed: {
    version: function () {
      return this.$store.state.version;
    },
    user: function(){
      return this.$store.state.user
    }
  },
};
</script>

<style lang="scss" scoped>
header {
  // position: sticky;
  background-color: $white;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;

  box-shadow: $shadow;

  .content-wrapper {
    display: flex;
    align-items: center;
  }

  .content-wrapper > * {
    padding: $big-padding 0;
  }
}

.nav-menu {
  display: flex;
  align-items: center;

  
    z-index: 2000;

  @include media_phone {
    justify-content: flex-end;
    align-items: stretch;
    flex-direction: column-reverse;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $white;
    transition: transform 0.3s;

    &.active {
      transform: translateX(100%);
    }
  }
}

.version {
  opacity: 0.5;
  margin-right: $padding;
}

ul {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    display: block;
    box-sizing: border-box;
  }

  @include media_phone {
    flex-direction: column;
    margin-top: 3em;
  }
}

.brand {
  margin-right: auto;
  a {
    padding: 0;
  }
}

a {
  padding: $padding;
  text-transform: uppercase;
  display: block;

  @include media_phone {
    padding: 3 * $padding;
    font-size: $large-font;
  }
}

.user {
  display: flex;
  align-items: stretch;
  color: $white;
  border-radius: 20px;
  margin-left: $padding * 2;
  overflow: hidden;


  > * {
    display: block;
    color: $white;
    display: flex;
    white-space: nowrap;
    align-items: center;

    background-color: $primary-color;

    &:hover {
      background-color: lighten($primary-color, 10);
    }

    padding: $padding/2 $padding;
    @include interactive();
  }

  > div {
    padding-right: 2 * $padding;
  }

  .material-design-icon {
    margin-right: $padding;
  }

  @include media_phone {
    position: fixed;
    top: 0;
    right: 0;
    justify-content: flex-end;
    > * {
      padding: 3 * $padding;
      background-color: transparent;
      color: $primary-color;

      &:hover {
        color: darken($primary-color, 15%);
        background-color: transparent;
      }
    }
  }
}
.lang-version-grp {

    display: flex;


  @include media_phone {
    justify-content: space-between;

    > * {
      padding: 3 * $padding;
    }
  }
}
@include media_phone {
  .nav-menu.active {
    .nav-toggle {
      transform: translateX(-100%);
    }
  }
}

.nav-toggle {
  display: none;
  transition: all 0.3s;
  @include interactive;

  @include media_phone {
    display: block;
    align-self: flex-start;
    // position: fixed;

    padding: 2em;
  }
}
</style>
