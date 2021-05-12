<template>
  <form @submit.prevent="submit">
    <h3 v-if="title">{{ title }}</h3>

    <span>Email</span>
    <input type="email" :value="email" @input="emailChanged" required />
    <span>Password</span>
    <input
      type="password"
      :value="password"
      @input="passwordChanged"
      required
    />
    <p v-if="loginError">{{ loginError }}</p>
    <button type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  name: "UserForm",
  props: {
    title: String,
    email: String,
    password: String,
    loginError: String,
  },
  methods: {
    passwordChanged: function (event) {
      this.changed({ password: event.currentTarget.value });
    },
    emailChanged: function (event) {
      this.changed({ email: event.currentTarget.value });
    },
    changed: function (args) {
      const inputObject = Object.assign(
        {},
        {
          email: this.email,
          password: this.password,
        },
        args
      );

      this.$emit("input", inputObject);
    },
    submit(event) {
      this.$emit("submit", event);
    },
  },
};
</script>

<style lang="scss" scoped>
form > * {
  display: block;
  margin-top: 20px;
}
</style>