<template>
  <router-link :to="to" class="card-link" :class="className">
    <img
      v-if="img"
      class="card-link-background-image"
      :src="img"
      :class="imageClass"
    />
    <article>
      <header><arrow-right class="ugly" /> <slot /></header>

      <div class="body">
        <slot name="body" />
      </div>
    </article>
    <!-- <footer>
      
    </footer> -->
  </router-link>
</template>

<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight.vue';
export default {
  components: {
    ArrowRight,
  },
  props: {
    to: Object || String,
    img: String,
    contain: Boolean,
  },
  computed: {
    className() {
      return this.img ? 'card-link-image' : '';
    },
    imageClass() {
      return this.contain ? 'contain' : 'cover';
    },
  },
};
</script>

<style lang='scss' scoped>
.card-link {
  display: flex;
  flex-wrap: wrap;

  flex-direction: row;
  flex-wrap: wrap;
  color: $white;
  position: relative;
  background-color: $primary-color;
  border: $border;
  border-radius: 5px;
  // max-height: 300px;
  // padding: $big-box-padding;

  footer {
    z-index: 100;
  }

  // filter: grayscale(50%);
}

header {
  display: inline-flex;
  font-size: $large-font;
  padding: $big-box-padding;
  align-items: center;
  text-align: right;
  min-width: 100px;
  align-self: flex-end;
}

footer {
  display: flex;
  justify-content: flex-end;
}

article {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
}

.card-link-background-image {
  // position: absolute;
  // top: 0;
  // left: 0;

  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  &.contain {
    max-width: none;
    max-height: none;
    width: 20vw;
    height: 20vw;
    object-fit: contain;
    object-position: top right;
  }
}
</style>