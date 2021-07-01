<template>
  <div class="confirmation">
    <div class="text">
      {{ text }}
    </div>
    <footer>
      <div class="ok button" @click="confirm">Ok</div>
      <div class="cancel button" @click="cancel">Abbrechen</div>
    </footer>
  </div>
</template>



<script>
export default {
  name: "confirmation",
  props: {
    text: String,
  },
};
</script>
<style lang="scss" scoped>
.confirmation {
  background-color: $white;
 
}

.text {
    padding: $padding*3;
}

footer {
    display: flex;

    >* {
        flex: 1;
        text-align: center;
    }
}

.ok {
    color: $white;
    background-color: $primary-color;
}
</style>