<template>
  <div class="collapsible">
    <header class="collapsible-header" @click="toggleCollapse">
      <slot name="header" />

      <div class="icon">
        <ChevronUp v-if="!collapsed" />
        <ChevronDown v-if="collapsed" />
      </div>
    </header>

    <div v-if="!collapsed" class="collapsible-content">
      <slot />
    </div>
  </div>
</template>

<script>
import ChevronUp from 'vue-material-design-icons/ChevronUp';
import ChevronDown from 'vue-material-design-icons/ChevronDown';
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline';

export default {
  name: 'ListFilterContainer',
  components: {
    ChevronUp,
    ChevronDown,
    AlertCircleOutline,
  },
  data: function () {
    return {
      collapsed: true,
    };
  },
  methods: {
    toggleCollapse: function () {
      this.collapsed = !this.collapsed;

      if (this.collapsed) {
        this.$emit('close');
      } else {
        this.$emit('open');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_import.scss';

header {
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
  position: relative;
}

.icon {
  margin-left: auto;
}

.material-design-icon {
  display: block;
  display: flex;
  align-items: center;
}
</style>
