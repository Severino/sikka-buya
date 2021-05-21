<template>
  <section>
    <Box>
      <user-form
        title="Login"
        :email="email"
        :password="password"
        @input="inputChanged"
        @submit="login"
        async
        function=": async function"
      />
      <p v-if="loginError">{{ loginError }}</p>
    </Box>
  </section>
</template>

<script>
import Auth from "../../../utils/Auth";

import UserForm from "../../auth/UserForm.vue";
import Box from "../../layout/Box.vue";

export default {
  components: { Box, UserForm },
  name: "LoginPage",
  data: function() {
    return {
      email: "",
      password: "",
      loginError: "",
    };
  },
  methods: {
    inputChanged({ email, password } = {}) {
      Object.assign(this.$data, {
        email: email,
        password,
      });
    },
    login: function() {
      console.log("Submit");
      Auth.login(this.email, this.password).then(({message, success, user}) => {
        if (!success) {
          this.loginError = message;
        } else {
          this.$store.commit("login", user)
          this.$router.push({ name: "Editor" });
        }
      }).catch(console.error);
    },
  },
};
</script>

<style lang="scss" scoped>
section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  align-items: stretch;
  max-width: 100%;
  background-color: $white;
  @include box-padding($big-padding);
}

form {
  width: 230px;
  display: flex;
  flex-direction: column;
}
</style>
