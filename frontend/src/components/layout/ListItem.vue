<template>
  <div class="list-item" @click="click">
    <div class="list-item-row" :class="{ ['disable-input']: disable }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    to: Object,
    disable: Boolean,
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



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/scss/_import.scss';

.list-item:not(:last-of-type) {
  .list-item-row {
    border-bottom-width: 0;
  }
}

.list-item-row {
  @include interactive();
  @include input();
  padding: $padding;

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
