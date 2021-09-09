<template>
  <Button :class="{ waiting }" @click="clicked">
    <div v-if="waiting">
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
    waiting: Boolean,
  },
  methods: {
    clicked: function() {
      if (!this.waiting) {
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

.button.waiting {
  padding: 0;
  background-color: desaturate($color: $primary-color, $amount: 15);
  cursor: not-allowed;
  box-shadow: inset 1px 2px 3px rgba($color: #000000, $alpha: 0.2);
}
</style>
