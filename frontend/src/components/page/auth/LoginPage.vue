<template>
  <section class="center-box">
    <login-form @login="toEditorPage" />
  </section>
</template>


<script>
import LoginForm from "../../auth/LoginForm.vue";

export default {
  components: { LoginForm },
  name: "LoginPage",
  methods: {
    toEditorPage: function () {
      this.$router.push({ name: "Editor" });
    },
  },
};
</script>
