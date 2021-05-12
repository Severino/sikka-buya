<template>
  <section class="hero">
    <Box>
      <h3>Setup</h3>
      <p style="font-style: italic">
        This is the initial setup page. Enter the username and the password for
        the superuser. Once the super user is set, this site won't be accessible
        anymore!
      </p>
      <user-form
        :email="email"
        :password="password"
        @input="formChanged"
        @submit="submit"
      />

      <p v-if="response">{{ response }}</p>
    </Box>
  </section>
</template>

<script>
import Query from "../../database/query";
import UserForm from "../auth/UserForm";
import Box from "../layout/Box.vue";
export default {
  components: { UserForm, Box },
  data: function () {
    return {
      email: "",
      password: "",
      response: "",
    };
  },
  methods: {
    formChanged: function (obj) {
      Object.assign(this.$data, obj);
    },
    submit: function () {
      Query.raw(
        `
        mutation{
          setup(data:{
            email: "${this.email}"
            password:"${this.password}"
          })
        }
     `
      )
        .then(() => {
          this.response = "Succesfully created superuser!";
        })
        .catch((err) => {
          this.response = `Could not create superuser: ${err}.`;
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