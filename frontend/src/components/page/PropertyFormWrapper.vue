<template>
  <div class="material-page">
    <h1>{{ title }}</h1>
    <LoadingSpinner class="loading-spinner" :size="50" v-if="loading" />
    <form v-if="!loading" @submit.prevent>
      <slot></slot>
      <div v-if="error" class="information error">
        {{ error }}
      </div>
      <Row class="button-bar">
        <button type="button" @click.prevent.stop="cancel">
          {{ $t('form.cancel') }}
        </button>
        <button id="submit-btn" type="submit" @click="submit">
          {{ $t('form.submit') }}
        </button>
      </Row>
    </form>
  </div>
</template>

<script>
import Row from '../layout/Row.vue';
import LoadingSpinner from '../misc/LoadingSpinner.vue';

export default {
  name: 'PropertyFormWrapper',
  props: {
    title: String,
    property: {
      type: String,
      required: true,
    },
    overwriteRoute: String,
    loading: Boolean,
    error: String,
  },
  components: {
    LoadingSpinner,
    Row,
  },
  methods: {
    submit: function () {
      this.$emit('submit');
    },
    cancel: function () {
      if (this.overwriteRoute) {
        this.$router.push({ name: this.overwriteRoute });
      } else {
        this.$router.push({
          name: 'Property',
          params: { property: this.property },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_import.scss';

form {
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: $padding;
  }
}
</style>
