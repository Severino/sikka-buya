<template>
  <MultiButton>
    <Button
      @click="selectType(type.id)"
      :class="{
        active: active,
      }"
    >
      {{ type.projectId }}
    </Button>
    <Button
      :class="{
        active: active,
      }"
    >
      <router-link
        :to="{ name: 'Catalog Entry', params: { id: type.id } }"
        target="_blank"
        ><ExternalLinkIcon :size="16"
      /></router-link>
    </Button>
  </MultiButton>
</template>

<script>
import ExternalLinkIcon from 'vue-material-design-icons/OpenInNew.vue';
import MultiButton from '../../layout/buttons/MultiButton.vue';
export default {
  components: { ExternalLinkIcon, MultiButton },
  props: {
    active: Boolean,
    type: Object,
  },
  methods: {
    selectType() {
      this.$emit('change', this.type.id);
    },
  },
};
</script>
