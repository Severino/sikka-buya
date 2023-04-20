<template>
  <div
    class="slideshow"
    ref="slideshow"
  >
    <scroll-view>
      <div
        class="slides"
        ref="slides"
      >
        <new-slide @click.native="requestSlide()" />
        <template v-for="(slide, idx) of slides">
          <slide
            :key="`slide-${idx}`"
            :number="idx + 1"
            :options="slide.options"
            :class="{ active: idx === currentSlide }"
            @select="setSlide(idx)"
          />
          <new-slide
            :key="`new-slide-${idx}`"
            @click.native="requestSlide(idx + 1)"
          />
        </template>
      </div>
    </scroll-view>
    <div class="tool-bar">
      <div
        class="button icon-button"
        @click="prevSlide"
      >
        <PrevIcon :size="iconSize" />
      </div>
      <div
        class="button icon-button"
        @click="requestSlide(currentSlide, true)"
      >
        <SyncIcon :size="iconSize" />
        <div class="text">
          <Locale path="slideshow.override" />
        </div>
      </div>
      <div
        class="button icon-button"
        @click="requestSlide()"
      >
        <CameraOutlineIcon :size="iconSize" />
        <div class="text">
          <Locale path="slideshow.record" />
        </div>
      </div>
      <div
        class="button icon-button"
        @click="removeSlide()"
      >
        <DeleteIcon :size="iconSize" />
        <div class="text">
          <Locale path="slideshow.delete" />
        </div>
      </div>
      <div
        class="button icon-button"
        @click="nextSlide"
      >
        <NextIcon :size="iconSize" />
      </div>
    </div>
  </div>
</template>

<script>
import NewSlide from './NewSlide.vue';
import Slide from './Slide.vue';
import CameraOutlineIcon from 'vue-material-design-icons/CameraOutline.vue';
import NextIcon from 'vue-material-design-icons/SkipNext.vue';
import PrevIcon from 'vue-material-design-icons/SkipPrevious.vue';
import ScrollView from '../../../layout/ScrollView.vue';
import SyncIcon from 'vue-material-design-icons/Sync.vue';
import DeleteIcon from 'vue-material-design-icons/Delete.vue';
import Locale from '../../../cms/Locale.vue';

const storagePostFix = '-slideshow';

export default {
  components: {
    Slide,
    NewSlide,
    CameraOutlineIcon,
    NextIcon,
    PrevIcon,
    ScrollView,
    DeleteIcon,
    SyncIcon,
    Locale,
  },
  props: {
    storagePrefix: String,
  },
  data() {
    return {
      slides: [],
      slideId: 0,
      currentSlide: 0,
      iconSize: 18,
    };
  },
  mounted() {
    this.registerEventListener()
    this.loadSlides()
  },
  beforeDestroy() {
    this.removeEventListener()
  },
  methods: {
    registerEventListener() {
      this.scrollContent.addEventListener('wheel', this.scroll);
      document.addEventListener('keydown', this.handleHotkeys);

    },
    removeEventListener() {
      this.scrollContent.removeEventListener('wheel', this.scroll);
      document.removeEventListener('keydown', this.handleHotkeys);
    },
    handleHotkeys(event) {
      if (event.key === 'PageUp') {
        this.prevSlide();
      } else if (event.key === 'PageDown') {
        this.nextSlide();
      }
    },
    loadSlides() {
      if (this.storagePrefix) {
        try {
          this.slides =
            JSON.parse(window.localStorage.getItem(this.storageName)) || [];

          // We need to wait for next tick for other components to be mounted
          this.$nextTick(() => {
            this.$root.$emit('slides-loaded', { slideshow: this, slides: this.slides });
          })

        } catch (e) {
          console.warn(
            'Could not load slideshow from localStorage. This warning is normal when no slideshow was saved.'
          );
        }
      }
    },
    updateSlides(slides) {
      this.slides = slides;
      this.saveSlides();
    },
    getName(slide) {
      if (slide?.options?.year) {
        return slide.options.year === 'null' ? null : slide.options.year;
      } else {
        return null;
      }
    },
    scroll(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      const scroll = evt.deltaY;
      const sensitivity = 0.3;
      const scrollLeft = this.scrollContent.scrollLeft;
      this.scrollContent.scrollLeft = scrollLeft + scroll * sensitivity;
    },
    requestSlide(index, overwrite) {
      this.$root.$emit('request-slide-options', {
        slideshow: this,
        index,
        overwrite,
      });
    },
    createSlide(options, index = null, overwrite = false) {
      const slide = {
        name: null,
        options,
      };

      if (index == null) this.slides.push(slide);
      else {
        const deleteCount = overwrite ? 1 : 0;
        this.slides.splice(index, deleteCount, slide);
      }

      this.currentSlide = index == null ? this.slides.length - 1 : index;

      this.slideChanged();
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
      if (index == null) index = this.currentSlide;
      if (index === this.slides.length - 1) {
        this.currentSlide = this.slides.length - 2;
      }

      this.slides.splice(index, 1);
      this.slideChanged();
    },
    slideChanged() {
      this.saveSlides();
    },
    saveSlides() {
      if (this.storagePrefix) {
        localStorage.setItem(this.storageName, JSON.stringify(this.slides));
      }else throw new Error('No storage prefix set.');
    }
  },
  computed: {
    scrollContent() {
      return this.$refs.slideshow.querySelector('.simplebar-content-wrapper');
    },
    storageName() {
      return this.storagePrefix + storagePostFix;
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
  overflow-x: clip;
  overflow-y: visible;
  border: $border;
  display: flex;
  flex-direction: column;

  >*:not(:last-child) {
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

  >* {
    margin-right: math.div($padding, 2);
  }
}

.tool-bar {
  display: flex;
  background-color: $white;

  >* {
    flex: 1;
  }
}

.icon-button .text {
  display: none;
}

@include media-min-desktop() {
  .icon-button .text {
    display: inline;
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