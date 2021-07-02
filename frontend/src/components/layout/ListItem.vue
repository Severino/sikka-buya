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
    click: function() {
      this.$emit("click");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/scss/_import.scss";

.list-item:not(:last-of-type) {
  background-color: red;
  .list-item-row {
    border-bottom-width: 0;
  }
}

.list-item-row {
  @include interactive();
  @include input();
  padding: 3px $padding;

  position: relative;
  display: flex;
  align-items: center;
}

.removeBtn {
  position: absolute;
  right: 0;
  max-height: 100%;
}

.slot {
  flex: 1;
  display: flex;

  > * {
    flex: 1;
  }
}
</style>
