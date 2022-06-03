<template>
  <div class="login-page">
    <section class="center-box">
      <login-form @login="toEditorPage" />
    </section>
  </div>
</template>


<script>
import LoginForm from '../../auth/LoginForm.vue';

export default {
  components: { LoginForm },
  name: 'LoginPage',
  methods: {
    toEditorPage: function () {
      this.$router.push({ name: 'Editor' });
    },
  },
};
</script>
