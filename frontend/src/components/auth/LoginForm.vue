<template>
  <Box class="login-form">
    <form ref="form" @keydown="enter">
      <user-form
        title="Login"
        :email="email"
        :password="password"
        :disabled="buttonDisabled"
        @input="inputChanged"
      />
    </form>
    <ErrorMessage v-if="loginError">{{ loginError }}</ErrorMessage>

    <async-button
      ref="loginBtn"
      @click="login"
      class="colored"
      :pending="buttonDisabled"
    >
      Anmelden
    </async-button>
  </Box>
</template>

<script>
import Auth from '../../utils/Auth';
import Box from '../layout/Box.vue';
import UserForm from '../auth/UserForm';
import AsyncButton from '../layout/buttons/AsyncButton.vue';
import ErrorMessage from '../ErrorMessage.vue';
import Async from '../../utils/Async';

export default {
  components: { Box, UserForm, AsyncButton, ErrorMessage },
  name: 'LoginForm',
  data: function () {
    return {
      email: '',
      password: '',
      loginError: '',
      buttonDisabled: false,
    };
  },
  methods: {
    enter(evt) {
      if (evt.key === 'Enter') {
        console.log('ENTER');
        this.$refs['loginBtn'].$el.click();
      }
    },

    inputChanged({ email, password } = {}) {
      Object.assign(this.$data, {
        email: email,
        password,
      });
    },
    login: function () {
      if (this.$refs.form.checkValidity()) {
        this.loginError = '';
        this.buttonDisabled = true;
        const startTime = Date.now();
        const minSecondsToWait = 1.5;
        Auth.login(this.email, this.password)
          .then(async ({ message, success, user }) => {
            /**
             * It's weird and looks junky, when the button is resolved too
             * quickly. So we introduce an artifical delay to improve the UX.
             */
            const timeLeft = minSecondsToWait * 1000 - (Date.now() - startTime);
            console.log(timeLeft);
            await Async.sleep(timeLeft);

            if (!success) {
              this.loginError = message;
            } else {
              this.$store.commit('login', user);
              this.$emit('login');
            }
          })
          .catch((err) => {
            console.error('ERROR: ', err);
            this.loginError = err;
          })
          .finally(() => {
            this.buttonDisabled = false;
          });
      } else {
        this.$refs.form.reportValidity();
      }
    },
  },
};
</script>

<style lang="scss">
.login-form {
  .button {
    justify-content: center;
  }
}
</style>

<style lang="scss" scoped>
.box {
  align-items: stretch;
  max-width: 100%;
  width: 512px;
  background-color: $white;
  padding: 50px 60px;
  border-radius: 15px;
  box-shadow: $shadow;

  > *:not(:last-child) {
    margin-bottom: $padding * 2;
  }
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
