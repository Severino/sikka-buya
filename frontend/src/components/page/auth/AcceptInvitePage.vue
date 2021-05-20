<template>
  <section>
    <Box>
      <form action="">
        <h3>{{ $t("system.register_title") }}</h3>
        <label for="">{{ $tc("system.email") }}</label>
        <input type="text" id="email" :value="email" readonly />
        <label for="password">{{ $tc("system.password") }}</label>
        <input
          type="password"
          v-model="password"
          name="new-password"
          id="password"
        />
        <button @click.prevent="submit">{{ $t("system.register") }}</button>
        <p v-if="error">{{ error }}</p>
      </form>
    </Box>
  </section>
</template>

<script>
import Query from "../../../database/query";
import Box from "../../layout/Box.vue";
export default {
  name: "AcceptInvitePage",
  components: { Box },
  data: function () {
    return {
      password: "",
      error: "",
    };
  },
  methods: {
    submit: function (args) {
      Query.raw(
        `mutation AcceptInvite($email:String, $password:String) {
            acceptInvite(email:$email, password:$password)
            }`,
        {
          email: this.email,
          password: this.password,
        }
      )
        .then(result=>{
            this.error = ""
            this.$router.push({name: "Login"})
        })
        .catch((err) => {
          this.error = err;
        });
    },
  },
  computed: {
    email: function () {
      return this.$route.params.mail;
    },
  },
};
</script>

<style lang="scss" scoped>
form > * {
  display: block;
  margin-top: $padding;
}
</style>