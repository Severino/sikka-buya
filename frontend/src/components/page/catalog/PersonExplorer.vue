<template>
  <div class="person-explorer">
    <div class="list">
      <collapsible v-for="person of persons" :key="person.id">
        <template slot="header">{{ person.name }} </template>
      </collapsible>
    </div>
  </div>
</template>

<script>
import Query from '../../../database/query';
import Collapsible from '../../layout/Collapsible.vue';
export default {
  components: { Collapsible },
  data: function () {
    return {
      persons: [],
    };
  },
  mounted() {
    Query.raw(
      `{
          person {
              name
          } 
          }`
    )
      .then((result) => {
        console.log(result);
        this.persons = result.data.data.person;
      })
      .catch(console.error);
  },
};
</script>

<style lang="scss" scoped>
</style>