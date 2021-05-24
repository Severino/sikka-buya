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
        <button :disabled="disabled" @click.prevent="submit">{{ $t("system.register") }}</button>
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
      disabled: false
    };
  },
  methods: {
    submit: function (args) {
      this.disabled = true
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
        }).finally(()=>{
          this.disabled=false
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

button {
  color: $white;
  font-weight: bold;
  background-color: $primary-color;

  &[disabled]{
    background-color: gray;
  }
}

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
  align-items: stretch;
  max-width: 100%;
  background-color: $white;
  @include box-padding($big-padding);
}

form {
  width: 230px;
  display: flex;
  flex-direction: column;
  >* {
    margin-top: $padding;
  }
}
</style>