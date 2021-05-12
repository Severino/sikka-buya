<template>
  <section>
    <Box>
      <user-form
        title="Login"
        :email="email"
        :password="password"
        @input="inputChanged"
        @submit="submit"
      />
      <p v-if="loginError">{{ loginError }}</p>
    </Box>
  </section>
</template>

<script>
import Auth from "../../utils/Auth";

import UserForm from "../auth/UserForm.vue";
import Box from "../layout/Box.vue";

export default {
  components: { Box, UserForm },
  name: "LoginPage",
  data: function () {
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
    submit() {
      Auth.login(this.email, this.password).then(({ success, message }) => {
        console.log(success, message);
        if (!success) {
          this.loginError = message;
        } else {
          this.$router.push({ name: "PropertyOverview" });
        }
      });
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
  max-width: 100%;
  width: 720px;
  background-color: $white;
  @include box-padding($big-padding);
}
</style>