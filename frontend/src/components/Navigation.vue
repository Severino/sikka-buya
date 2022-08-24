<template>
  <header :class="{ minimized }">
    <div class="content-wrapper">
      <div class="brand">
        <router-link :to="{ name: 'Home' }">
          <img
            v-if="minimized"
            src="@/assets/images/sikka-buya-no-logo.png"
            alt=""
          />
          <img v-else src="/img/logos/sikka-logo.svg" alt="" />
        </router-link>
      </div>
      <div class="nav-menu" :class="{ active: active }">
        <nav>
          <ul>
            <li
              v-for="(item, index) in visibleItems"
              :key="`nav-item-${index}`"
            >
              <router-link :to="item.target">{{ item.name }}</router-link>
            </li>
          </ul>
        </nav>
        <div class="lang-version-grp">
          <span class="version">{{ version }}</span>
          <div class="languages">DE</div>
        </div>

        <div v-if="loggedIn" class="user" id="user-toolbar">
          <router-link :to="{ name: 'Editor' }">
            <AccountShield :size="18" />
          </router-link>
          <div id="nav-logout-button" @click="logout">
            {{ $t('system.logout') }}
          </div>
        </div>
        <div class="nav-toggle" @click="toggleMenu()">
          <Close v-if="active" />
          <Menu v-else />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import AccountShield from 'vue-material-design-icons/ShieldAccount';

import Menu from 'vue-material-design-icons/Menu';
import Close from 'vue-material-design-icons/Close';

import Auth from '../utils/Auth';

export default {
  name: 'Navigation',
  components: {
    AccountShield,
    Menu,
    Close,
  },
  data: function () {
    return {
      active: false,
      minimized: false,
      items: [
        // { name: "Home", target: "undefined" },
        { name: 'Karte', target: { name: 'Map Landing' }, auth: true },
        { name: 'Typekatalog', target: { name: 'Catalog' }, auth: true },
        { name: 'Analytics', target: { name: 'Analytics' }, auth: true },
      ],
    };
  },
  methods: {
    toggleMenu: function () {
      this.active = !this.active;
    },
    logout: function () {
      Auth.logout();
      this.$store.commit('logout');
      this.$router.push({ name: 'Home' });
    },
  },
  mounted: function () {
    this.minimized = this.$route.meta.smallNav ? true : false;
  },
  watch: {
    $route(to, from) {
      this.minimized = to.meta.smallNav ? true : false;
    },
  },
  computed: {
    version: function () {
      return this.$store.state.version;
    },
    visibleItems() {
      let items = [];
      if (this.loggedIn) {
        items = this.items;
      } else {
        items = this.items.filter((item) => !item.auth);
      }
      return items;
    },
    loggedIn: function () {
      return this.$store.getters.loggedIn;
    },
  },
};
</script>

<style lang="scss" scoped>
#nav-logout-button {
  text-transform: capitalize;
}

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

    > * {
      padding: $big-padding 0;
    }
  }

  &.minimized {
    img {
      margin-top: 5px;
      height: 30px;
    }

    .content-wrapper {
      width: auto;
      justify-content: space-between;
    }

    .content-wrapper > * {
      padding: 5px 0;
    }
  }
}

.nav-menu {
  display: flex;
  align-items: center;

  z-index: 20000000;

  @include media_phone {
    position: fixed;
    justify-content: flex-end;
    align-items: stretch;
    flex-direction: column-reverse;
    top: 0;
    left: 100vw;
    width: 100vw;
    height: 100%;
    background-color: $white;
    transition: transform 0.3s;

    &.active {
      transform: translateX(-100%);
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
  img {
    height: 32px;
  }
}

a {
  color: $black;
  font-weight: normal;

  padding: $padding;
  // text-transform: uppercase;
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
  > :first-child {
    border-right: 2px solid white;
  }

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

  // .material-design-icon {
  //   margin-right: $padding;
  // }

  @include media_phone {
    position: absolute;
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
      transform: translateX(0);
    }
  }
}

.nav-toggle {
  display: none;
  transition: all 0.3s;
  transform: translateX(-100%);
  @include interactive;

  background-color: white;
  @include media_phone {
    display: block;
    align-self: flex-start;
    // position: fixed;

    padding: 2em;
  }
}
</style>
