<template>
  <div class="page">
    <back-header :to="{ name: 'Editor' }" />
    <h1>User Management</h1>
    <section>
      <form submit.stop.prevent="">
        <h2>Add New User</h2>

        <span>Email</span>
        <input type="email" v-model="inviteEmail" />
        <input type="submit" value="Invite" @click.prevent="inviteUser" />
      </form>
    </section>
    <section>
      <h2>Registered Users</h2>
      <div class="error" v-if="listError">{{ listError }}</div>
      <div class="user-list">
        <div v-for="user in users" class="user" :key="`user-id-${user.id}`">
          <span class="email">{{ user.email }}</span>
          <div class="permissions">{{ user.super ? 'SUPER' : 'User' }}</div>
          <copy-field :value="getInvitePath(user.email)" />
          <dynamic-delete-button @delete="deleteUser(user.id)" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Query from '../../database/query';
import ErrorMessage from '../ErrorMessage.vue';
import CopyField from '../forms/CopyField.vue';
import BackHeader from '../layout/BackHeader.vue';
import DynamicDeleteButton from '../layout/DynamicDeleteButton.vue';
export default {
  name: 'UserManagement',
  components: {
    BackHeader,
    CopyField,
    ErrorMessage,
    DynamicDeleteButton,
  },
  data: function () {
    return {
      listError: '',
      inviteEmail: '',
      users: [Object],
    };
  },
  mounted: function () {
    this.refreshUserList();
  },
  methods: {
    getInvitePath: function (email) {
      return window.location.origin + '/invite/' + email;
    },
    deleteUser: async function (id) {
      await Query.raw(`mutation{deleteUser(id:${id})}`);
      this.refreshUserList();
    },
    refreshUserList: async function () {
      let result = await Query.raw(`{
            users{
                email
                id
                super
            }
        }`);

      if (result && result.data && result.data.data && result.data.data.users) {
        this.users = result.data.data.users;
        this.listError = '';
      } else {
        this.users = [];
        this.listError = 'Nutzerliste konnte nicht geladen werden!';
      }
    },
    inviteUser: async function () {
      Query.raw(
        `mutation{
          inviteUser(email: "${this.inviteEmail}")
        }`
      )
        .then((result) => {
          this.inviteEmail = '';
          this.refreshUserList();
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit('printError', err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  @include box;
}
form > * {
  display: block;
  margin-top: $padding;
}

.user {
  display: grid;
  grid-template-columns: 3fr 1fr 5fr 40px;
  gap: $padding;
  align-items: center;
  margin: $padding 0;
}
</style>
