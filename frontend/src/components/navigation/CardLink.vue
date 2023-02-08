<template>
  <div class="card-link" :class="className">
    <img v-if="img" class="card-link-background-image" :src="img" />
    <header>
      <slot name="header" />
    </header>
    <div class="body">
      <slot />
    </div>
    <footer>
      <ArrowRight />
    </footer>
  </div>
</template>

<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight.vue';
export default {
  components: {
    ArrowRight,
  },
  props: {
    img: String,
  },
  computed: {
    className() {
      return this.img ? 'card-link-image' : '';
    },
  },
};
</script>

<style lang='scss' scoped>
.card-link {
  display: flex;
  flex-direction: column;
  min-height: 360px;
  color: $white;
  background-size: cover;
  position: relative;
  background-color: $primary-color;
  border: $border;
  border-radius: 5px;
  padding: $big-box-padding;

  footer {
    z-index: 100;
  }

  // filter: grayscale(50%);
}

.card-link-image {
  header {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 25%;
    box-sizing: border-box;
    padding: $padding * 2;
    background-color: rgba($primary-color, 0.75);
    backdrop-filter: blur(3px);
  }
}

.body {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

footer {
  display: flex;
  justify-content: flex-end;
}

.card-link-background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>