<template>
  <section>
    <Box>
      <template #header>
        <h2>
          <Locale path="system.signup_title" />
        </h2>
      </template>
      <form
        action=""
        @submit.prevent="submit"
      >

        <label for="">
          <Locale path="system.email" />
        </label>
        <input
          type="text"
          id="email"
          :value="email"
          readonly
        />
        <label for="password">
          <Locale path="system.password" />
        </label>
        <input
          type="password"
          v-model="password"
          name="new-password"
          id="password"
        />
        <error-message :error="error" />
      </form>

      <template #footer>
        <segmented-row>
          <template v-slot:right>
            <Button
              class="button big-button signup-button"
              :disabled="disabled"
            >
              <Locale path="system.signup" />
            </Button>
          </template>
        </segmented-row>
      </template>
    </Box>
  </section>
</template>

<script>
import Query from '../../../database/query';
import Locale from '../../cms/Locale.vue';
import Button from '../../layout/buttons/Button.vue';
import ErrorMessage from '../../ErrorMessage.vue';
import Box from '../../layout/Box.vue';
import SegmentedRow from '../../layout/SegmentedRow.vue';
export default {
  name: 'AcceptInvitePage',
  components: { Box, Button, ErrorMessage, SegmentedRow, Locale },
  data: function () {
    return {
      password: '',
      error: '',
      disabled: false,
    };
  },
  methods: {
    submit: function () {
      this.disabled = true;
      Query.raw(
        `mutation AcceptInvite($email:String, $password:String) {
            acceptInvite(email:$email, password:$password)
            }`,
        {
          email: this.email,
          password: this.password,
        }
      )
        .then((result) => {
          this.error = '';
          this.$router.push({ name: 'Login' });
        })
        .catch((err) => {
          this.error = err;
        })
        .finally(() => {
          this.disabled = false;
        });
      return false
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

  &[disabled] {
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
  //   width: 230px;
  //   display: flex;
  flex-direction: column;

  input {
    width: 100%;
  }

  >* {
    display: block;
    margin-top: $padding;
  }
}
</style>