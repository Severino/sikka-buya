<template>
  <section>
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
</style>