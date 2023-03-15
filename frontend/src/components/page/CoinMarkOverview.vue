<template>
  <Overview
    createPage="CreateCoinMark"
    property="coin_mark"
    overrideProperty="coinmark"
    query="coinMark"
    ref="overview"
  />
</template>

<script>
import Overview from './Overview.vue';
export default {
  components: {
    Overview,
  },
};
</script>