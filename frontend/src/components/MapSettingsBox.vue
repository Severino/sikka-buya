<template>
  <div class="settings">

    <PopupActivator
      :targetWidth="280"
      :noShadow="true"
    >

      <SettingsIcon :size="iconSize" class="button icon-button" />

      <template v-slot:popup>
          <h3>Einstellungen</h3>
          <slot />
          <Button
            class="small-button"
            @click="resetSettings"
          >
            <ResetIcon
              class="reset-icon"
              :size="16"
            />
            Standard wiederherstellen
          </Button>
      </template>
    </PopupActivator>

  </div>
</template>

<script>
import SettingsIcon from 'vue-material-design-icons/Cog.vue';
import ResetIcon from 'vue-material-design-icons/Restart.vue';
import PopupActivator from './Popup/PopupActivator.vue';

export default {
  components: {
    SettingsIcon,
    ResetIcon,
    PopupActivator
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    iconSize: {
      type: Number,
      default: 22,
    }
  },
  methods: {
    resetSettings() {
      this.$emit('reset');
    },
    toggleSettings() {
      this.$emit('toggle');
    },
  },
};
</script>

<style lang="scss">
.settings {


  .reset-icon {
    padding-right: $padding;
  }


  .small-button {
    width: 100%;
  }

  label {
    font-size: $small-font;
  }
}
</style>