<template>
  <div class="content">
    <h1>Vergleiche letzte Bereinigung</h1>

    <p v-if="error != ''" class="error">
      {{ error }}
    </p>

    <p v-if="data">Letzte Durchführung: {{ data.lastModified }}</p>

    <div class="type" v-for="type in data.items" :key="'type-' + type.id">
      <router-link
        target="_blank"
        :to="{ name: 'EditType', params: { id: type.id } }"
        ><h2>{{ type.name }}</h2></router-link
      >

      <div
        v-for="[name, diffObj] of Object.entries(type.fields)"
        class="property"
        :key="'type-' + type.id + '-property-' + name"
      >
        <h4>{{ name }}</h4>
        <div class="compare">
          <div class="col old">
            <label>Alt</label>
            <div v-html="diffObj.old"></div>
          </div>
          <div class="col new">
            <label>Neu</label>
            <div v-html="diffObj.new"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FixDiff',
  data: function () {
    return {
      error: '',
      data: {},
    };
  },
  mounted: function () {
    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:4000/last-fix');
    request.onreadystatechange = (event) => {
      if (request.readyState == 4) {
        if (request.status >= 200 && request.status < 300) {
          try {
            const json = JSON.parse(request.responseText);
            this.data = json;
          } catch (e) {
            this.error = e;
          }
        } else {
          this.error = `Die Datei konnte nicht geladen werden: ${request.statusText} - ${request.responseText}.`;
        }
      }
    };
    request.send();
    console.log('Send');
  },
};
</script>

<style lang="scss" scoped>
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