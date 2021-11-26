<template>
  <div class="material-form">
    <PropertyFormWrapper
      @submit="submit"
      @cancel="cancel"
      :loading="loading"
      property="material"
      :title="$tc('property.material')"
      :error="error"
    >
      <input v-model="material.id" type="hidden" />
      <input
        type="text"
        v-model="material.name"
        :placeholder="$tc('attribute.name')"
        autofocus
        required
      />
    </PropertyFormWrapper>
  </div>
</template>

<script>
import Query from '../../../database/query.js';
import PropertyFormWrapper from '../PropertyFormWrapper.vue';

export default {
  components: { PropertyFormWrapper },
  name: 'MaterialForm',
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      Query.raw(
        `{
        getMaterial(id: ${id}){id name}
      }`
      )
        .then((result) => {
          this.material = result.data.data.getMaterial;
        })
        .catch((err) => {
          this.$data.error = this.$t('error.loading_element');
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
      Query.raw(
        `
      mutation{
        updateMaterial(data: {id: ${this.material.id}, name: "${this.material.name}" })
      }
      `
      )
        .then(() => {
          this.$router.push({
            name: 'Property',
            params: { property: 'material' },
          });
        })
        .catch((err) => {
          this.error = err.join('\n');
        });
    },
    cancel: function () {
      this.$router.push({ path: '/material' });
    },
  },
  data: function () {
    return {
      error: '',
      loading: true,
      material: { id: -1, name: '' },
    };
  },
};
</script>
