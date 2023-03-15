<template>
  <Overview createPage="CreateCoinVerse" property="coin_verse" overrideProperty="coinverse" query="coinVerse"
    ref="overview" />
</template>


<script>
import Overview from './Overview.vue';
export default {
  components: {
    Overview,
  },
};
</script>