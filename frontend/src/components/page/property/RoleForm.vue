<template>
  <div class="role-form">
    <PropertyFormWrapper
      @submit="submit"
      @cancel="cancel"
      property="role"
      :title="$tc('property.role')"
      :loading="loading"
      :error="error"
    >
      <input v-model="role.id" type="hidden" />
      <input
        type="text"
        v-model="role.name"
        :placeholder="$tc('attribute.name')"
        autofocus
        required
      />
    </PropertyFormWrapper>
  </div>
</template>

<script>
import Query from "../../../database/query.js";
import PropertyFormWrapper from "../PropertyFormWrapper.vue";

export default {
  components: { PropertyFormWrapper },
  name: "RoleForm",
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      new Query("role")
        .get(id, ["id", "name"])
        .then((result) => {
          this.role = result.data.data.getRole;
        })
        .catch((err) => {
          this.$data.error = this.$t("error.loading_element");
          console.log(err);
        })
        .finally(() => {
          this.$data.loading = false;
        });
    } else {
      this.$data.loading = false;
    }
  },
  methods: {
    submit: function () {
      new Query("role")
        .update(this.role)
        .then(() => {
          this.$router.push({
            name: "Property",
            params: { property: "role" },
          });
        })
        .catch((err) => {
          this.error = this.$t("error.could_not_update_element");
          console.error(err);
        });
    },
    cancel: function () {
      this.$router.push({ path: "/role" });
    },
  },
  data: function () {
    return {
      error: "",
      loading: true,
      role: { id: -1, name: "" },
    };
  },
};
</script>
