<template>
  <div class="analytics">
    <header>
      <row>
        <div v-for="(obj, index) in analytics" :key="`an-${index}`" class="box">
          <h3>{{ obj.name }}</h3>
          <span>{{ obj.value }}</span>
        </div>
      </row>
    </header>
    <h3>Analytics</h3>
    <ul>
      <li v-for="(link, idx) of links" :key="`list-btn-${idx}`">
        <router-link :to="link.to" class="button">
          {{ link.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import Query from '../../../database/query';
import Row from '../../layout/Row.vue';
export default {
  name: 'AnalyticsDashboard',
  components: { Row },
  created: function () {
    Query.raw(
      `{
          getAnalytics{
  typeCount
  yearCount
  mintCount
}
}`
    )
      .then((obj) => {
        this.mintCount = obj.data.data.getAnalytics.mintCount;
        this.typeCount = obj.data.data.getAnalytics.typeCount;
        this.yearCount = obj.data.data.getAnalytics.yearCount;
      })
      .catch(console.error);
  },
  data: function () {
    return {
      mintCount: '',
      typeCount: '',
      yearCount: '',
      links: [{ name: 'Year Link Table', to: { name: 'AnalyticsTable' } }],
    };
  },
  computed: {
    analytics: function () {
      return [
        { name: 'Typen', value: this.typeCount },
        { name: 'Münzstätten', value: this.mintCount },
        { name: 'Abgedeckte Jahre', value: this.yearCount },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  margin-top: 1em;
}

.box {
  background-color: $white;
  padding: $padding * 2 $padding * 3;
  text-align: center;

  h3 {
    margin: 0;
  }
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>