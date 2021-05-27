<template>
  <header>
    <div class="content-wrapper">
      <div class="brand">
        <router-link :to="{name:'Home'}">
        <img src="@/assets/images/sikka-buya.png" alt="" />
        </router-link>
      </div>
      <nav>
        <ul>
          <li v-for="(item, index) in items" :key="`nav-item-${index}`">
            <router-link :to="item.target">{{ item.name }}</router-link>
          </li>
        </ul>
      </nav>
      <span class="version">{{ version }}</span>
      <div class="languages">DE</div>
      <div v-if="user" class="user">
        <router-link :to="{ name: 'Editor' }">
          <AccountCircle />
        </router-link>
        <div @click="logout">{{ $t("system.logout") }}</div>
      </div>
    </div>
  </header>
</template>

<script>
import AccountCircle from "vue-material-design-icons/AccountCircle";
import Auth from "../utils/Auth";

export default {
  name: "Navigation",
  components: {
    AccountCircle,
  },
  created: function () {
    this.user = Auth.loadUser();
    this.$store.commit("login", this.user);
  },
  data: function () {
    return {
      user: null,
      items: [
        // { name: "Home", target: "undefined" },
        // { name: "Kartenanwendung", target: "undefined" },
        // { name: "Typekatalog", target: "undefined" },
      ],
    };
  },
  methods: {
    logout: function () {
      Auth.logout();
      this.user = null;
      this.$router.push({ name: "Home" });
    },
  },
  watch: {
    $route(to, from) {
      this.user = Auth.loadUser();
      this.$store.commit("login", this.user);
    },
  },
  computed: {
    version: function () {
      console.log(this.$store.version);
      return this.$store.state.version;
    },
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

.version {
  opacity: 0.5;
  margin-right: $padding;
}

ul {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
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
}
</style>
