<template>
  <div class="spinner" :style="{ width: `${size}px`, height:`${size}px` }"></div>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    size: Number,
  },
};
</script>

<style lang="scss" scoped>
$color: #48ac48;

.spinner {
  position: relative;

  @mixin circle($time, $delay) {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;

    animation: $time infinite growing;
animation-timing-function: linear;

    animation-delay: $delay;
  }

  &:after {
    @include circle(2s, 0);

  }

  &:before {
    @include circle(2s, -1s);
  }
}

@keyframes growing {
  0% {
    background-color: $white;
    transform: scale(0.3);
    opacity: 0;
    z-index: 100;
  }
  20%{
    
    background-color: $white;
    opacity: 1;
    }
  80% {opacity: 1;}
  100%{    
    background-color: $color;

    opacity: 0;
    transform: scale(0.8);
    z-index: 0;
  }
}
</style>