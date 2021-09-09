<template>
  <div class="search" :class="{ active }">
    <input
      type="search"
      :placeholder="$t('message.filter_list')"
      @input="input"
      :value="value"
    />
    <loading-spinner v-if="pending" class="spinner" :size="30" />
    <Magnify v-else />
  </div>
</template>

<script>
import Magnify from 'vue-material-design-icons/Magnify';
import LoadingSpinner from '../misc/LoadingSpinner.vue';
export default {
  components: {
    Magnify,
    LoadingSpinner,
  },
  data: function() {
    return {
      timeout: null,
      delay: 750,
      pending: false,
      pendingI: 0,
      i: 0,
    };
  },
  props: {
    value: String,
    asyncSearch: Function,
  },
  methods: {
    input(event) {
      let value = event.target.value;

      if (value != '' && this.asyncSearch) {
        this.i++;

        this.pending = true;
        this.pendingI = this.i;

        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }

        // We use a local variable, that we dont override a new
        // search, that may happen before the callback is triggered.
        this.timeout = setTimeout(() => {
          this.asyncSearch(this.value).finally(() => {
            // Only change it back, when no input has occured in the meantime!
            if (this.i == this.pendingI) {
              this.pending = false;
            }
          });
        }, this.delay);
      }
      this.$emit('input', value);
    },
  },

  computed: {
    active: function() {
      return this.value != '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_import.scss';
.search {
  display: flex;
  position: relative;

  &.active {
    input {
      border-color: $primary-color;
    }
    .material-design-icon {
      color: $primary-color;
    }
  }

  > input {
    box-sizing: border-box;
    flex: 1;
    padding-left: 45px;

    transition: all 0.3s;
  }

  .spinner {
    position: absolute;
    top: 4px;
    left: $padding - 3;

    &::before,
    &::after {
      background-color: $primary-color;
    }
  }

  .material-design-icon {
    position: absolute;
    top: 7px;
    left: $padding;
    color: gray;
    pointer-events: none;
    transition: all 0.3s;
  }
}
</style>
