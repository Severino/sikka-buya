<template>
  <section class="hero">
    <Box>
      <h3>Setup</h3>

      <div v-if="!databaseExists">
        <p class="error">
          Database is not connected. Setup the backend first! And make sure that
          the express server is running!
        </p>
      </div>
      <div v-else>
        <p style="font-style: italic">
          This is the initial setup page. Enter the username and the password
          for the superuser. Once the super user is set, this site won't be
          accessible anymore!
        </p>
        <form action.prevent>
          <user-form
            :email="email"
            :password="password"
            @input="formChanged"
            @submit="submit"
          />
        </form>
        <p v-if="response" class="success">{{ response }}</p>
        <p v-if="response" class="error">{{ error }}</p>

        <segmented-row>
          <template v-slot:right>
            <Button @click="submit">Submit</Button>
          </template>
        </segmented-row>
      </div>
    </Box>
  </section>
</template>

<script>
import Query from '../../database/query';
import UserForm from '../auth/UserForm';
import Box from '../layout/Box.vue';
import Button from '../layout/buttons/Button.vue';
import Row from '../layout/Row.vue';
import SegmentedRow from '../layout/SegmentedRow.vue';
export default {
  components: { UserForm, Box, Button, Row, SegmentedRow },
  data: function () {
    return {
      email: '',
      password: '',
      response: '',
      error: '',
      databaseExists: false,
    };
  },
  mounted: function () {
    Query.raw(
      `
      {
        databaseExists
      }
      `
    )
      .then((result) => {
        this.databaseExists = result.data.data.databaseExists;
      })
      .catch(console.error);
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
          }){
            success
            message
            token
          }
        }
     `
      )
        .then(() => {
          this.error = '';
          this.response = 'Succesfully created superuser!';
        })
        .catch((err) => {
          this.response = '';
          this.error = `Could not create superuser: ${err}.`;
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
}

form {
  margin-bottom: $padding;
}
</style>