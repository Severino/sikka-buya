<template>
  <span class="list-item-cell">
    <router-link v-if="to" :to="to" class="text">
      <slot />
    </router-link>
    <div class="text" v-else>
      <slot />
    </div>
  </span>
</template>

<script>
export default {
  props: {
    to: Object,
  },
  methods: {
    click: function () {
      if (!this.disable) {
        if (this.to) {
          this.$router.push(this.to);
        } else this.$emit('click');
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.list-item-cell {
  @include input;
  @include interactive;
  flex: 1;
  align-items: center;
  display: flex;
}
</style>