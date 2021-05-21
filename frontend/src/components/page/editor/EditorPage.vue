<template>
  <div class="editor">
    <header>
      <div class="content-wrapper">
        <router-link :to="{name: 'EditorPage'}">Editor</router-link>

        <div class="user">
          <span>{{ user.email }}</span>
          <div class="button" @click="logout">Sign Out</div>
        </div>
      </div>
    </header>
    <div class="content-wrapper">
      <router-view> </router-view>
    </div>
  </div>
</template>

<script>
import Auth from "../../../utils/Auth";
export default {
  name: "EditorPage",
  created: function () {
    let user = Auth.loadUser();
    console.log(user);
    if (user) {
      this.$data.user = user;
    }
  },
  data: function () {
    return {
      user: {
        email: "Unknown",
        id: 0,
      },
    };
  },
  methods: {
    logout: function () {
      Auth.logout();
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  background-color: black;
  color: white;
  > .content-wrapper {
    flex: 1;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.user {
  display: flex;
  align-items: center;

  > * {
    margin-left: $padding;
  }
}
</style>