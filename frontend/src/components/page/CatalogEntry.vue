<template>
  <div class="catalogEntry">
    <header>
      <h1>{{ title }}</h1>
    </header>
    <div class="catalogFields">
      <div class="property-row">
        <div
          class="property"
          v-for="(val, idx) of ['mint', 'material', 'year', 'nominal']"
          v-bind:key="`property-${val}-${idx}`"
        >
          <div class="property-label">
            {{ $tc(`property.${val}`) }}
          </div>
          <div class="property-value">
            {{ $data[val] }}
          </div>
        </div>
      </div>

      <h2>Persons</h2>
      <div class="person-wrapper">
        <div
          class="person-container"
          v-for="(val, idx) of persons"
          v-bind:key="`person-${val}-${idx}`"
        >
          <catalog-item
            :label="$tc(`person.${val}`)"
            :value="$data[val]"
          ></catalog-item>
        </div>
      </div>
    </div>
    <div class="coin-sides">
      <div class="avers">
        
      <h2>Avers</h2>
      </div>
      <div class="revers">
        
      <h2>Revers</h2>
      </div>
    </div>
  </div>
</template>

<script>
import CatalogItem from "../catalog/CatalogItem.vue";
export default {
  components: { CatalogItem },
  name: "CatalogEntry",
  data: function() {
    return {
      title: "Šīr322",
      mint: "Šīrāz",
      issuers: ["Adam", "Eve"],
      overlords: [
        "ʿImād ad-Daula ssssssssssssssssssssss ",
        "ʿAlī b. Būya",
        "ʿ᾽l-Ḥasan ʿAlī",
      ],
      caliph: "Is-no-good",
      heir: "Bushido al Vassai",
      warden: "Warden Buldo",
      cutter: "Boda Lina",
    };
  },
  methods: {
    get(property) {
      return this[property];
    },
  },
  computed: {
    persons: function() {
      let persons = [
        "issuers",
        "overlords",
        "caliph",
        "heir",
        "warden",
        "cutter",
      ];

      console.log(persons.filter((name) => this[name]));
      return persons.filter((name) => this[name]);
    },
  },
};
</script>

<style lang="scss" scoped>
.property-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.person-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;

  > * {
    column-span: 2;
  }
}

.coin-sides {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
