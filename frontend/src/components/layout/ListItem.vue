<template>
  <div class="list-item" @click="click">
    <router-link v-if="to" :to="to">
      <div class="list-item-row"><slot></slot></div>
    </router-link>
    <div v-else class="list-item-row">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListItem",
  props: {
    to: Object,
  },
  methods: {
    click: function () {
      this.$emit("click");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/scss/_import.scss";

.list-item-row {
  @include interactive();
  @include input();

  position: relative;
  display: flex;
  align-items: center;
  border-bottom-width: 0;

  &:last-of-type {
    border-bottom-width: 1px;
  }
}

.removeBtn {
  position: absolute;
  right: 0;
  max-height: 100%;
}

.slot {
  flex: 1;
  // padding: $padding;
  display: flex;

  > * {
    flex: 1;
  }
}
</style> 