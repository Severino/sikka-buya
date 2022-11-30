<template>
  <div class="dynasty-form">
    <PropertyFormWrapper
      @submit="submit"
      @cancel="cancel"
      :loading="loading"
      property="dynasty"
      :title="$tc('property.dynasty')"
      :error="error"
      :disabled="disabled"
    >
      <input id="dynasty-id" v-model="dynasty.id" type="hidden" />
      <input
        id="dynasty-name"
        type="text"
        v-model="dynasty.name"
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
  name: 'DynastyForm',
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      new Query('dynasty')
        .get(id, ['id', 'name'])
        .then((result) => {
          this.dynasty = result.data.data.getDynasty;
          this.disabled = false;
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
      this.disabled = false;
    }
  },
  methods: {
    submit: function () {
      new Query('dynasty')
        .update(this.dynasty)
        .then(() => {
          this.$router.push({
            name: 'Property',
            params: { property: 'dynasty' },
          });
        })
        .catch((err) => {
          this.error = this.$t('error.could_not_update_element');
          console.error(err);
        });
    },
    cancel: function () {
      this.$router.push({ path: '/dynasty' });
    },
  },
  data: function () {
    return {
      error: '',
      loading: true,
      dynasty: { id: -1, name: '' },
      disabled: true,
    };
  },
};
</script>
