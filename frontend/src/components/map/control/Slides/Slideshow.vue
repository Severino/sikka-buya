<template>
  <div class="slideshow" ref="slideshow">
    <scroll-view>
      <div class="slides" ref="slides">
        <new-slide @click.native="requestSlide()" />
        <template v-for="(slide, idx) of slides">
          <slide
            :key="`slide-${idx}`"
            :name="getName(slide, idx)"
            :class="{ active: idx === currentSlide }"
            @select="setSlide(idx)"
            @delete="removeSlide(idx)"
          />
          <new-slide
            :key="`new-slide-${idx}`"
            @click.native="requestSlide(idx + 1)"
          />
        </template>
      </div>
    </scroll-view>
    <div class="tool-bar">
      <div class="button icon-button" @click="prevSlide">
        <PrevIcon />
      </div>
      <div class="button icon-button" @click="requestSlide()">
        <CameraOutlineIcon />
      </div>
      <div class="button icon-button" @click="nextSlide">
        <NextIcon />
      </div>
    </div>
  </div>
</template>

<script>
import NewSlide from './NewSlide.vue';
import Slide from './Slide.vue';
import CameraOutlineIcon from 'vue-material-design-icons/CameraOutline.vue';
import NextIcon from 'vue-material-design-icons/SkipNextCircleOutline.vue';
import PrevIcon from 'vue-material-design-icons/SkipPreviousCircleOutline.vue';
import ScrollView from '../../../layout/ScrollView.vue';

export default {
  components: {
    Slide,
    NewSlide,
    CameraOutlineIcon,
    NextIcon,
    PrevIcon,
    ScrollView,
  },
  data() {
    return {
      slides: [],
      slideId: 0,
      selectedSlide: -1,
      currentSlide: 0,
    };
  },
  mounted() {
    this.scrollContent.addEventListener('wheel', this.scroll);
  },
  unmounted() {
    this.scrollContent.removeEventListener('wheel', this.scroll);
  },
  methods: {
    getName(slide, idx) {
      return slide?.options?.year?.toString() || slide?.name || idx.toString();
    },
    scroll(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      const scroll = evt.deltaY;
      const sensitivity = 0.3;
      const scrollLeft = this.scrollContent.scrollLeft;
      this.scrollContent.scrollLeft = scrollLeft + scroll * sensitivity;
    },
    requestSlide(index) {
      this.$root.$emit('request-slide', { slideshow: this, index });
    },
    createSlide(options, index = null) {
      const slide = {
        name: (this.slideId++).toString(),
        options,
      };

      if (index == null) this.slides.push(slide);
      else this.slides.splice(index, 0, slide);
    },
    nextSlide() {
      const length = this.slides.length;
      if (length > 0) {
        if (this.currentSlide < 0 || this.currentSlide >= length - 1)
          this.currentSlide = 0;
        else {
          this.currentSlide += 1;
        }
      }
      this.updateSlide();
    },
    prevSlide() {
      const length = this.slides.length;
      if (length > 0) {
        if (this.currentSlide <= 0) this.currentSlide = length - 1;
        else {
          this.currentSlide -= 1;
        }
      }
      this.updateSlide();
    },
    updateSlide() {
      if (this.currentSlide >= 0 && this.currentSlide < this.slides.length) {
        this.$root.$emit('apply-slide', this.slides[this.currentSlide].options);
      } else console.warn('Slide index is out of range.');
    },
    setSlide(index) {
      this.currentSlide = index;
      this.updateSlide();
    },
    removeSlide(index) {
      this.slides.splice(index, 1);
    },
  },
  computed: {
    scrollContent() {
      return this.$refs.slideshow.querySelector('.simplebar-content-wrapper');
    },
  },
};
</script>
<style lang='scss'>
.slideshow {
  .slideshow-item {
    flex-shrink: 0;
  }
}
</style>
<style lang='scss' scoped>
.slideshow {
  background-color: whitesmoke;
  border-radius: $border-radius;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  border: $border;
  display: flex;
  flex-direction: column;

  > *:not(:last-child) {
    margin-right: $padding;
  }

  &:focus {
    outline: $primary-color;
  }
}

.slides {
  display: flex;
  justify-content: flex-start;
  padding: $padding;
  padding-bottom: 2 * $padding;

  > * {
    margin-right: $padding/2;
  }
}

.tool-bar {
  display: flex;
  background-color: $white;
  > * {
    flex: 1;
  }
}

.icon-button {
  color: $gray;
  padding: 0px;
  border-radius: 0;
  box-sizing: border-box;
  border-color: $dark-white;
  &:not(:last-child) {
    border-right-width: 0;
  }

  &:hover {
    color: $black;
  }
}
</style>