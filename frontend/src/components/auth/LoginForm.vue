<template>
  <Box>
    <user-form
      title="Login"
      :email="email"
      :password="password"
      :disabled="buttonDisabled"
      @input="inputChanged"
      @submit="login"
      async
      function=": async function"
    />
    <p v-if="loginError">{{ loginError }}</p>
  </Box>
</template>

<script>
import Auth from '../../utils/Auth';
import Box from '../layout/Box.vue';
import UserForm from '../auth/UserForm';
export default {
  components: { Box, UserForm },
  name: "LoginForm",
  data: function () {
    return {
      email: "",
      password: "",
      loginError: "",
      buttonDisabled: false,
    };
  },
  methods: {
    inputChanged({ email, password } = {}) {
      Object.assign(this.$data, {
        email: email,
        password,
      });
    },
    login: function () {
      this.buttonDisabled = true;
      Auth.login(this.email, this.password)
        .then(({ message, success, user }) => {
          if (!success) {
            this.loginError = message;
          } else {
            this.$store.commit("login", user);
            this.$emit("login")
          }
        })
        .catch((err) => {
          console.error(err);
          this.loginError = err;
        })
        .finally(() => {
          this.buttonDisabled = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>

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
