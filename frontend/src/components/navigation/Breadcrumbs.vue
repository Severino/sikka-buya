<template>
  <div class="breadcrumbs">
    <span class="crumb" v-for="matched in $route.matched" :key="matched.name">
      <router-link :to="matched">
        {{ $tc(`routes.${matched.name}`) }}</router-link
      >
    </span>
  </div>
</template>

<style lang="scss" scoped>
.breadcrumbs {
  padding: $padding;
  display: flex;
  max-width: 100%;
  overflow-y: auto;
}

.crumb {
  $color: $white;

  @mixin common {
    content: '';
    height: 0;
    display: inline-block;
    border: 17px solid transparent;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin-left: -12px;

  a {
    color: $gray;
    background-color: $color;
    padding: $padding;
  }

  &:first-child {
    a {
      padding-left: 3 * $padding;
    }
  }

  &:not(:first-child) {
    &:before {
      @include common;
      border-right-width: 0;
      border-top-color: $color;
      border-bottom-color: $color;
    }
  }

  &:after {
    @include common;
    border-right-width: 0;
    border-left-color: $color;
  }

  &:last-child {
    a {
      color: $green;
    }
    &:after {
      @include common;
      border-right-width: 17px;
      border-color: $color;
      border-top-right-radius: 17px;
      border-bottom-right-radius: 17px;
    }
  }
}
</style>