<template>
  <div class="honorific-form">
    <PropertyFormWrapper
      @submit="submit"
      :loading="loading"
      :title="$tc('property.honorific')"
      property="honorific"
      :error="error"
    >
      <input v-model="honorific.id" type="hidden" />
      <input
        type="text"
        v-model="honorific.name"
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
  name: 'HonorificForm',
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      new Query('honorific')
        .get(id, ['id', 'name'])
        .then((result) => {
          this.honorific = result.data.data.getHonorific;
        })
        .catch((err) => {
          this.$data.error = this.$t('error.loading_element');
          console.error(err);
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
      new Query('honorific')
        .update(this.honorific)
        .then(() => {
          this.$router.push({
            name: 'Property',
            params: { property: 'honorific' },
          });
        })
        .catch((err) => {
          this.error = this.$t('error.could_not_update_element');
          console.error(err);
        });
    },
  },
  data: function () {
    return {
      error: '',
      loading: true,
      honorific: { id: -1, name: '' },
    };
  },
};
</script>
