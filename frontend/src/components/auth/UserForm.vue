<template>
  <fieldset>
    <h3 v-if="title">{{ title }}</h3>

    <label for="username">Email</label>
    <input
      id="username"
      name="username"
      type="email"
      :value="email"
      @input="emailChanged"
      required
      autocomplete="username"
      autofocus
    />

    <label for="cpassword">Password</label>
    <input
      type="password"
      id="cpassword"
      name="current-password"
      :value="password"
      @input="passwordChanged"
      autocomplete="current-password"
      required
    />
    <p v-if="loginError">{{ loginError }}</p>
  </fieldset>
</template>

<script>
import AsyncButton from '../layout/buttons/AsyncButton.vue';
export default {
  components: { AsyncButton },
  name: 'UserForm',
  props: {
    title: String,
    email: String,
    password: String,
    loginError: String,
    disabled: Boolean,
  },
  methods: {
    passwordChanged: function(event) {
      this.changed({ password: event.currentTarget.value });
    },
    emailChanged: function(event) {
      this.changed({ email: event.currentTarget.value });
    },
    changed: function(args) {
      const inputObject = Object.assign(
        {},
        {
          email: this.email,
          password: this.password,
        },
        args
      );

      this.$emit('input', inputObject);
    },
  },
};
</script>

<style lang="scss" scoped>
fieldset {
  border: none;
  padding: 0;
  width: 100%;
}

input {
  width: 100%;
  box-sizing: border-box;
}

fieldset > *:not(:first-child, input, button) {
  display: block;
  margin-top: $padding;
}

button {
  margin-top: 3 * $padding;
}

h3 {
  user-select: none;
  margin-top: 0;
}
</style>
