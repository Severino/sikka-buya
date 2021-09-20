<template>
  <div class="confirmation">
    <div class="text">
      <slot />
    </div>
    <footer>
      <div class="ok button" @click="$emit('result', true)">Ok</div>
      <div class="cancel button" @click="$emit('result', false)">Abbrechen</div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'confirmation',
};
</script>
<style lang="scss" scoped>
.confirmation {
  background-color: $white;
  padding: $padding * 2;
}

footer {
  margin-top: 20px;
  display: flex;

  > * {
    flex: 1;
    text-align: center;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}

.ok {
  color: $white;
  background-color: $primary-color;
}
</style>
