<template>
  <Box class="login-form" title="Login">
    <form ref="form" @keydown="enter">
      <user-form
        :email="email"
        :password="password"
        :disabled="buttonDisabled"
        @input="inputChanged"
      />
    </form>
    <ErrorMessage v-if="loginError">{{ loginError }}</ErrorMessage>

    <segmented-row>
      <template v-slot:right>
        <div>
          <async-button
            ref="loginBtn"
            @click="login"
            class="colored"
            :pending="buttonDisabled"
          >
            Anmelden
          </async-button>
        </div>
      </template>
    </segmented-row>
  </Box>
</template>

<script>
import Auth from '../../utils/Auth';
import Box from '../layout/Box.vue';
import UserForm from '../auth/UserForm';
import AsyncButton from '../layout/buttons/AsyncButton.vue';
import ErrorMessage from '../ErrorMessage.vue';
import Async from '../../utils/Async';
import SegmentedRow from '../layout/SegmentedRow.vue';

export default {
  components: { Box, UserForm, AsyncButton, ErrorMessage, SegmentedRow },
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
// .login-form {
//   .button {
//     justify-content: center;
//     margin-left: auto;
//   }
// }
</style>

<style lang="scss" scoped>
.buttons {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}
</style>
