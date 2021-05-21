<template>
  <div class="page">
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
import Query from "../../database/query";
import Auth from "../../utils/Auth";
import AxiosHelper from "../../utils/AxiosHelper";
export default {
  name: "UserManagement",
  data: function() {
    return {
      listError: "",
      inviteError: "",
      inviteEmail: "",
      users: [Object],
    };
  },
  mounted: function() {
    this.refreshUserList();
  },
  methods: {
    copy: function($event) {
      let target = $event.currentTarget;
      console.log(target);
      target.select();
      document.execCommand("copy");
    },
    getInvitePath: function(email) {
      return window.location.origin + "/invite/" + email;
    },
    refreshUserList: async function() {
      let result = await Query.raw(`{
            users{
                email
                id
                permissions {
                  id
                  name
                }
            }
        }`);

      if (result && result.data & result.data.users) {
        this.users = result.data.data.users;
        this.listError = "";
      } else {
        this.users = [];
        this.listError = "Nutzerliste konnte nicht geladen werden!";
      }
    },
    inviteUser: async function() {
      Query.raw(
        `mutation{
          inviteUser(email: "${this.inviteEmail}")
        }`
      )
        .then((result) => {
          this.inviteEmail = "";
          this.inviteError = "";
          this.refreshUserList();
        })
        .catch((err) => {
          console.log(err);
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
