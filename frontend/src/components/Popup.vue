<template>
  <div v-if="active" class="popup-anchor">
    <div class="popup-translator" ref="translator">
      <div class="popup" ref="popup">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popup",
  props: {
    active: Boolean
  },
  data: function () {
    return {
      offsetRight: 0,
      offsetLeft: 0,
    };
  },
  created: function () {
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
  },
  destroy: function () {
    window.removeEventListener("resize", this.resize);
  },
  mounted: function () {
    // We have to wait for the children to render
    this.keepInWindow();

    // setInterval(this.keepInWindow.bind(this), 1000);
  },
  methods: {
    resize: function () {
      this.keepInWindow.call(this);
    },
    keepInWindow: function () {
      if (this.$refs.popup) {


        let rect = this.$refs.popup.getBoundingClientRect();
        let whitespace = 20;

        const rightside = window.innerWidth - whitespace

        let originalRight = rect.right - this.offsetRight;

        if (originalRight > rightside) {
          this.offsetRight = rightside - originalRight;
        } else {
          this.offsetRight = 0;
        }

        let rightCss = parseInt(-this.offsetRight) + "px";
        this.$refs.popup.style.right = rightCss;

        const leftside = whitespace

        let originalLeft = rect.left- this.offsetLeft;

        if (originalLeft < leftside) {
          this.offsetLeft = leftside - originalLeft;
        } else {
          this.offsetLeft = 0;
        }

        let leftCss = parseInt(this.offsetLeft) + "px";

        this.$refs.popup.style.left = leftCss;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

$color: $white;
.popup {
  position: absolute;
  bottom:0;
  background-color: $color;

  padding: $padding;

  box-shadow: $shadow;
  z-index: 1000;
}

.popup-translator {
  position: absolute;

  width: 400px;

  min-height: 100px;

  transform: translate(-50%, -100%);
  top: -$padding;
  //   left: 50%;

  box-sizing: border-box;
  
}


.popup-anchor::before {
  content: "";
  width: 15px;
  height: 15px;
  transform: translateX(-1px) translateY(-120%) rotate(45deg);
display: block;
position: absolute;
top: 0;

  background-color: $color;
  
  box-shadow: $shadow;
}
</style>