<template>
  <header>
    <div class="content-wrapper">
      <div class="brand">
        <img src="@/assets/images/sikka-buya.png" alt="" />
      </div>
      <nav>
        <ul>
          <li v-for="(item, index) in items" :key="`nav-item-${index}`">
            <router-link :to="item.target">{{ item.name }}</router-link>
          </li>
        </ul>
      </nav>
      <div class="languages">
        DE
      </div>
      <div v-if="user" class="user">
        <router-link :to="{ name: 'Editor' }">
          <AccountCircle />
        </router-link>
        <div @click="logout">Logout</div>
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
  mounted: function() {
    this.user = Auth.loadUser();
  },
  data: function() {
    return {
      user: null,
      items: [
        // { name: "Home", target: "undefined" },
        // { name: "Kartenanwendung", target: "undefined" },
        // { name: "Typekatalog", target: "undefined" },
      ],
    };
  },methods: {
    logout: function(){
      Auth.logout()
      this.user = null
      this.$router.push({name: "Home"})
    }
  }
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

  > * {
    display: flex;
    align-items: center;
    padding: $big-padding 0;
  }
}

ul {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.brand {
  margin-right: auto;
}

a {
  padding: $padding;
  text-transform: uppercase;
}

.user {
  display: flex;
  alogn-items: center;
  background-color: $primary-color;
  color: $white;
  border-radius: 20px;
  margin-left: $padding * 2;

  >*{
    color: $white;
    display: flex;
    white-space: nowrap;
    
    padding: $padding/2 $padding;
    @include interactive()
  }

  >div {
    padding-right: 2*$padding;
  }

  .material-design-icon {
    margin-right: $padding;
  }
}
</style>
