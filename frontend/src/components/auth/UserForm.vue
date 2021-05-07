<template>
  <form @submit.prevent="submit">
    <h3 v-if="title">{{ title }}</h3>

    <span>Nutzername</span>
    <input type="text" :value="name" @input="nameChanged" required />
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
    name: String,
    password: String,
    loginError: String,
  },
  methods: {
    passwordChanged: function (event) {
      this.changed({ password: event.currentTarget.value });
    },
    nameChanged: function (event) {
      this.changed({ name: event.currentTarget.value });
    },
    changed: function (args) {
      const inputObject = Object.assign(
        {},
        {
          name: this.name,
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