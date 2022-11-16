<template>
  <div class="list-item">
    <router-link
      v-if="to"
      :to="to"
      class="list-item-row interactive"
      :class="{ ['disable-input']: disable }"
      @click.prevent="click"
    >
      <slot></slot>
    </router-link>
    <div
      v-else
      class="list-item-row"
      :class="{ ['disable-input']: disable }"
      @click.prevent="click"
    >
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
a {
  @include resetLinkStyle();
}

.list-item:not(:last-of-type) {
  .list-item-row {
    border-bottom-width: 0;
  }
}

.list-item-row {
  &.interactive {
    @include input();
    @include interactive();
  }

  background-color: $white;

  border-radius: 0;

  position: relative;
  display: flex;
  align-items: stretch;
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
