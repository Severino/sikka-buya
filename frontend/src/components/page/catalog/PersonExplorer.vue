<template>
  <div class="content-wrapper">
    <div class="person-explorer">
      <div class="list">
        <collapsible
          v-for="person of persons"
          :key="person.id"
          @open="getTypesByPerson(person)"
        >
          <template slot="header">{{ person.name }} </template>
          <div v-if="map[person.id]">
            <p
              v-if="
                !map[person.id] || Object.values(map[person.id]).length == 0
              "
              class="error"
            >
              Keine Typen mit dieser Person vorhanden
            </p>

            <collapsible
              v-for="(mint, idx) of Object.values(map[person.id])"
              :key="'mint-' + person.id + '-' + mint.value.name + '-' + idx"
            >
              <template slot="header">{{ mint.value.name }}</template>
            </collapsible>
          </div>
        </collapsible>
      </div>
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
      map: {},
    };
  },
  mounted() {
    Query.raw(
      `{
          person (role:null){
            id
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
  methods: {
    getTypesByPerson: function (person) {
      if (!this.map[person.id]) {
        Query.raw(
          `{
        getTypesByOverlord(id:${person.id})
        {
          id
          mint {id name}
          yearOfMint
        }
        }`
        )
          .then((result) => {
            const types = result.data.data.getTypesByOverlord;
            this.types = types;

            let mints = {};
            console.log(types);
            types.forEach((type) => {
              console.log(type);
              if (type?.mint?.id) {
                const mintId = type.mint.id;
                if (!mints[mintId])
                  mints[mintId] = { value: type.mint, children: [] };

                mints[mintId].children.push(type);
              }
            });

            this.$set(this.map, person.id, mints);
          })
          .catch(console.error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>