<template>
  <Button :class="{ pending }" @click="clicked">
    <div v-if="pending">
      <loading-spinner :size="38" />
    </div>
    <slot v-else />
  </Button>
</template>

<script>
import LoadingSpinner from '../../misc/LoadingSpinner.vue';
import Button from './Button.vue';

export default {
  components: { Button, LoadingSpinner },
  props: {
    pending: Boolean,
  },
  methods: {
    clicked: function () {
      if (!this.pending) {
        this.$emit('click');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button.pending {
  padding: 0;
  background-color: desaturate($color: $primary-color, $amount: 15);
  cursor: not-allowed;
  box-shadow: inset 1px 2px 3px rgba($color: #000000, $alpha: 0.2);
}
</style>
