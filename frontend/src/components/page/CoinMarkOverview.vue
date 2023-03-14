<template>
  <Overview
    createPage="CreateCoinMark"
    property="coin_mark"
    overrideProperty="coinmark"
    query="coinMark"
    @tool="toolRequested"
    ref="overview"
  />
</template>

<script>
import Query from '../../database/query';
import Overview from './Overview.vue';
export default {
  name: 'CoinMarkOverview',
  components: {
    Overview,
  },
};
</script>