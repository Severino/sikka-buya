<template>
  <Overview
    createPage="CreateCoinVerse"
    property="coin_verse"
    overrideProperty="coinverse"
    query="coinVerse"
    :tools="tools"
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
  data() {
    return {
      tools: ['move_to_coin_mark'],
    };
  },
  methods: {
    async toolRequested(name, options) {
      if (name === 'move_to_coin_mark') {
        if (options.id) {
          await Query.raw(
            `mutation {
              moveCoinVerseToCoinType(id: ${options.id})
          }`
          );
          this.$refs.overview.list();
        }
      } else console.error('Tool not implemented: ', name);
    },
  },
};
</script>