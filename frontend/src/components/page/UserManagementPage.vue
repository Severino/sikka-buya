<template>
  <div class="page">
    <back-header :to="{ name: 'Editor' }" />
    <h1>User Management</h1>
    <section>
      <form submit.stop.prevent="">
        <h2>Add User</h2>

        <span>Email</span>
        <input type="email" v-model="inviteEmail" />
        <input type="submit" value="Invite" @click.prevent="inviteUser" />
        <p v-if="inviteError">{{ inviteError }}</p>
      </form>
    </section>
    <section>
      <h2>Registered Users</h2>
      <div class="error" v-if="listError">{{ listError }}</div>
      <ul>
        <li v-for="user in users" :key="`user-id-${user.id}`">
          <span class="name">{{ user.email }}</span>
          <div class="permissions"></div>
          <input :value="getInvitePath(user.email)" @click="copy" readonly />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import Query from '../../database/query';
import BackHeader from '../layout/BackHeader.vue';
export default {
  name: 'UserManagement',
  components: {
    BackHeader,
  },
  data: function () {
    return {
      listError: '',
      inviteError: '',
      inviteEmail: '',
      users: [Object],
    };
  },
  mounted: function () {
    this.refreshUserList();
  },
  methods: {
    copy: function ($event) {
      let target = $event.currentTarget;
      target.select();
      document.execCommand('copy');
    },
    getInvitePath: function (email) {
      return window.location.origin + '/invite/' + email;
    },
    refreshUserList: async function () {
      let result = await Query.raw(`{
            users{
                email
                id
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
          this.inviteError = '';
          this.refreshUserList();
        })
        .catch((err) => {
          console.error(err);
          this.inviteError = err;
        });
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
