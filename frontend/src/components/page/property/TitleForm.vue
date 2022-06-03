<template>
  <div class="title-form">
    <PropertyFormWrapper
      @submit="submit"
      @cancel="cancel"
      property="title"
      :loading="loading"
      :title="$tc('property.title')"
      :error="error"
      :disabled="disabled"
    >
      <input id="title-id" v-model="title.id" type="hidden" />
      <input
        type="text"
        id="title-name"
        v-model="title.name"
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
  name: 'TitleForm',
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      new Query('title')
        .get(id, ['id', 'name'])
        .then((result) => {
          this.title = result.data.data.getTitle;
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
      new Query('title')
        .update(this.title)
        .then(() => {
          this.$router.push({
            name: 'Property',
            params: { property: 'title' },
          });
        })
        .catch((err) => {
          this.error = this.$t('error.could_not_update_element');
          console.error(err);
        });
    },
    cancel: function () {
      this.$router.push({ path: '/title' });
    },
  },
  data: function () {
    return {
      error: '',
      loading: true,
      title: { id: -1, name: '' },
      disabled: true,
    };
  },
};
</script>
