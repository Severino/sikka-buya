<template>
  <div class="page">
    <h1>User Management</h1>
    <section>
      <form submit.stop.prevent="">
        <h2>Add User</h2>

        <span>Email</span>
        <input type="email" v-model="inviteEmail" />
        <input type="submit" value="Invite" @click.prevent="" />
        <p v-if="inviteError">{{ inviteError }}</p>
      </form>
    </section>
    <section>
      <h2>Registered Users</h2>
      <ul>
        <li v-for="user in users" :key="`user-id-${user.id}`">
          ({{ user.id }}) {{ user.email }}
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
  data: function () {
    return {
      listError: "",
      inviteError: "",
      inviteEmail: "",
      users: [Object],
    };
  },
  mounted: function () {
    this.refreshUserList();
  },
  methods: {
    refreshUserList: async function () {
      let result = await Query.raw(`{
            users{
                email
                id
            }
        }`);

      if (result?.data?.data?.users) {
        this.users = result.data.data.users;
        this.listError = "";
      } else {
        this.users = [];
        this.listError = "Nutzerliste konnte nicht geladen werden!";
      }
    },
    inviteUser: async function () {
      Query.raw(
        `{
        inviteUser (
          email: ${this.inviteEmail}
          token: ${Auth.loadToken()}
        )
      }`
      )
        .then((result) => {
          if (AxiosHelper.ok(result)) {
            this.inviteEmail = "";
            this.inviteError = "";
          } else {
            this.inviteError = AxiosHelper.getErrors(result).join("\n\n");
          }
        })
        .catch((err) => {
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