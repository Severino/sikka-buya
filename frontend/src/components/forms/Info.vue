<template>
  <div :class="'info ' + type" :hidden="hidden">
    <slot />
  </div>
</template>

<script>
import CoinSideGroupVue from '../display/CoinSideGroup.vue';
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
      trigger_show: false,
    };
  },
  watch: {
    trigger: function () {
      console.log(this.trigger);
      this.show();
    },
  },
  methods: {
    show: function () {
      if (this.trigger_show == false) {
        this.trigger_show = true;
        if (this.$props.time > 0) {
          console.log('SET TIMEOUT');
          setTimeout(this.hide, this.$props.time);
        }
      }
    },
    hide: function () {
      this.trigger_show = false;
    },
  },
  computed: {
    visible() {
      return this.alwaysShow || this.trigger_show;
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
