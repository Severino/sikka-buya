<template>
  <div class="fix-diff content">
    <h1>Vergleiche letzte Bereinigung</h1>

    <p v-if="error != ''" class="error">
      {{ error }}
    </p>

    <p v-if="data">Letzte Durchführung: {{ data.lastModified }}</p>

    <div class="type" v-for="type in data.items" :key="'type-' + type.id">
      <header>
        <h2>{{ type.name }}</h2>
        <Button @click="edit(type)"><PencilIcon /> <span>Edit</span></Button>
      </header>
      <div
        v-for="[name, diffObj] of Object.entries(type.fields)"
        class="property"
        :key="'type-' + type.id + '-property-' + name"
      >
        <h4>{{ name }}</h4>
        <div class="compare">
          <div class="col old">
            <label>Vorher</label>
            <div v-html="diffObj.old"></div>
          </div>
          <div class="col new">
            <label>Nachher</label>
            <div v-html="diffObj.new"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Query from '../../database/query';
import Button from '../layout/buttons/Button.vue';
import PencilIcon from 'vue-material-design-icons/Pencil.vue';

export default {
  components: { Button, PencilIcon },
  name: 'FixDiff',
  data: function () {
    return {
      error: '',
      data: {},
    };
  },
  mounted: async function () {
    try {
      const results = await Query.raw('query { fixDiff }');
      this.data = JSON.parse(results.data.data.fixDiff);
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    edit(type) {
      let route = this.$router.resolve({
        name: 'EditType',
        params: { id: type.id },
      });
      window.open(route.href, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.fix-diff header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compare {
  display: grid;
  gap: 3px;
  grid-template-columns: repeat(2, 1fr);
}

label {
  position: absolute;
  top: 0px;
  left: 0px;

  color: rgb(199, 199, 199);
  text-transform: uppercase;
  background-color: rgb(163, 163, 163);
  padding: 5px 10px;
  border-bottom-right-radius: 10px;
}

.col {
  position: relative;

  padding: 50px;
  background-color: rgb(199, 199, 199);
  border-radius: 5px;
}
</style>