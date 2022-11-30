<template>
  <div class="dynasty-form">
    <PropertyFormWrapper
      @submit="submit"
      @cancel="cancel"
      :loading="loading"
      property="province"
      :title="$tc('property.province')"
      :error="error"
      :disabled="disabled"
    >
      <input id="province-id" v-model="province.id" type="hidden" />
      <input
        id="province-name"
        type="text"
        v-model="province.name"
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
  name: 'ProvinceForm',
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      new Query('province')
        .get(id, ['id', 'name'])
        .then((result) => {
          this.province = result.data.data.getProvince;
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
      this.disabled = false;
      this.$data.loading = false;
    }
  },
  methods: {
    submit: function () {
      new Query('province')
        .update(this.province)
        .then(() => {
          this.$router.push({
            name: 'Property',
            params: { property: 'province' },
          });
        })
        .catch((err) => {
          this.error = this.$t('error.could_not_update_element');
          console.error(err);
        });
    },
    cancel: function () {
      this.$router.push({ path: '/province' });
    },
  },
  data: function () {
    return {
      error: '',
      loading: true,
      province: { id: -1, name: '' },
      disabled: true,
    };
  },
};
</script>
