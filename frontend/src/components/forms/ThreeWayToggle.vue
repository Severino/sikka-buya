<template>
  <div class="three-way-toggle">
    <Button @click="select(false)" class="no" :class="isActive(false)"
      ><Close
    /></Button>
    <Button @click="select(null)" :class="isActive(null)"
      ><SlashForward
    /></Button>
    <Button @click="select(true)" class="yes" :class="isActive(true)"
      ><Check
    /></Button>
  </div>
</template>

<script>
import Button from '../layout/buttons/Button.vue';

import Check from 'vue-material-design-icons/Check.vue';
import Close from 'vue-material-design-icons/Close.vue';
import SlashForward from 'vue-material-design-icons/SlashForward.vue';

export default {
  components: { Button, Check, Close, SlashForward },
  props: {
    value: {
      validator: (val) => val === true || val === false || val === null,
      defaultValue: null,
      required: true,
    },
  },
  methods: {
    select(state) {
      this.$emit('input', state);
    },
    isActive(state) {
      return { active: state === this.value };
    },
  },
};
</script>


<style lang="scss">
.three-way-toggle {
  .material-design-icon {
    width: 16px;
    height: 16px;
  }
}
</style>

<style lang="scss" scoped>
.three-way-toggle {
  display: inline-flex;
  border: 1px solid gray;
  border-radius: $border-radius;

  .button {
    color: $gray;
    background-color: white;
    padding: 3px;
    border-radius: 0;
    border-color: transparent;
    flex: 1;
    justify-content: center;

    &.active {
      color: $white;
      background-color: $gray;

      &.yes {
        background-color: $green;
      }

      &.no {
        background-color: $red;
      }
    }

    &:first-child {
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
    }

    &:last-child {
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }
  }
}
</style>