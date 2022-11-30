<template>
  <Overview
    createPage="CreateCoinMark"
    property="coin_mark"
    overrideProperty="coinmark"
    query="coinMark"
    :tools="['move_to_verses']"
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
      tools: ['move_to_verses'],
    };
  },
  methods: {
    async toolRequested(name, options) {
      if (name === 'move_to_verses') {
        if (options.id) {
          await Query.raw(
            `mutation {
              moveCoinTypeToCoinVerse(id: ${options.id})
          }`
          );
          this.$refs.overview.list();
        }
      } else console.error('Tool not implemented: ', name);
    },
  },
};
</script>