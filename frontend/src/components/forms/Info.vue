<template>
  <div :class="'info ' + type" :hidden="hidden">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Info',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => {
        return ['info', 'error', 'warning'].indexOf(value) != -1;
      },
    },
    alwaysShow: {
      default: false,
      type: Boolean,
    },
    trigger: {
      default: 0,
      type: Number,
    },
    time: {
      type: Number,
      default: 0,
    },
  },
  data: function () {
    return {
      trigger_show: true,
    };
  },
  watch: {
    trigger: function () {
      this.show();
    },
  },
  methods: {
    show: function () {
      this.$data.trigger_show = false;

      if (this.$props.time > 0) {
        setTimeout(this.hide, this.$props.time);
      }
    },
    hide: function () {
      this.$data.trigger_show = true;
    },
  },
  computed: {
    visible() {
      return this.alwaysShow || (this.trigger > 0 && this.trigger_show);
    },
    hidden() {
      return !this.visible;
    },
  },
};
</script>

<style lang="scss">
@import '@/scss/_import.scss';

.info {
  color: white;
  background-color: gray;
  font-weight: bold;
  font-style: italic;
  padding: $padding;
  width: 100%;
  font-size: $small-font;
  box-sizing: border-box;
  text-align: center;
}

.warning {
  background-color: $yellow;
}

.error {
  background-color: $red;
}
</style>
