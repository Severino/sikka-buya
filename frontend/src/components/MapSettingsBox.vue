<template>
  <div class="settings">

    <PopupActivator
      :targetWidth="280"
      :noShadow="true"
    >
      <template v-slot="{ active }">
        <ButtonVue
          class="map-button"
          :active="active"
          :noStop="true"
        >

          <SettingsIcon
            :size="iconSize"
            class="button icon-button"
          />

          <Locale path="general.settings" />
        </ButtonVue>
      </template>

      <template v-slot:popup>
        <h3>Einstellungen</h3>
        <slot />
        <ButtonVue
          class="small-button"
          @click="resetSettings"
        >
          <ResetIcon
            class="reset-icon"
            :size="16"
          />
          Standard wiederherstellen
        </ButtonVue>
      </template>
    </PopupActivator>

  </div>
</template>

<script>
import SettingsIcon from 'vue-material-design-icons/Cog.vue';
import ResetIcon from 'vue-material-design-icons/Restart.vue';
import Locale from './cms/Locale.vue';
import ButtonVue from './layout/buttons/Button.vue';
import PopupActivator from './Popup/PopupActivator.vue';

export default {
  components: {
    SettingsIcon,
    ResetIcon,
    PopupActivator,
    Locale,
    ButtonVue
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