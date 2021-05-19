<template>
  <div class="button button-completed" @click.stop.prevent="toggle">
    <div v-if="value" class="active">
      <slot name="active"></slot>
    </div>
    <div class="inactive" v-else>
      <slot name="inactive"></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: "Toggle",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    toggle: function () {
      this.$emit("input", !this.value);
    },
    stop(event) {
      event.stopPropagation();
      event.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.active svg {
  fill: #3cb8ff;
}

.button {
  border-radius: 0 !important;
  border: none;
  background-color: transparent;

  &:hover {
    background-color: rgb(223, 223, 223);
  }
}
</style>