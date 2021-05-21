<template>
  <div class="page">
    <div v-if="error" class="error"></div>
    <table>
      <thead>
        <tr>
          <td></td>
          <td v-for="year in years" :key="'head-' + year" >{{ year }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mint in mints" :key="'row-' + mint" >
          <td>{{ mint }}</td>
          <td v-for="year in years" :key="'col-' + year + '-' + mint"
          class="color-box"
          :class="{exists: typeByMintAndYear(mint, year) }">
            <!-- {{ typeByMintAndYear(mint, year) }} -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Query from "../../../database/query";
export default {
  name: "YearMintTablePage",
  created: function () {
    Query.raw(
      `{
            getTypes{projectId, yearOfMinting, mint{name} }
        }`
    )
      .then((result) => {

        data = (result && result.data && result.data.data && result.data.getTypes)?result.data.getTypes: null
        if (data) {
          let min = Infinity;
          let max = -Infinity;

          let map = {};

          data.forEach((d) => {
            const mint = d.mint.name;
            const year = d.yearOfMinting;
            if (!map[mint]) map[mint] = new Set();
            map[mint].add(year);

            let numYear = parseInt(year);
            if (numYear) {
              if (year < min) min = numYear;
              if (year > max) max = numYear;
            } else console.error("Year is no number", year);
          });

          let yearArray = [];

          for (let i = min; i <= max; i++) {
            yearArray.push(i);
          }

          this.years = yearArray;
          this.map = map;
        } else {
          const message = "No data received!";
          console.error(message);
          this.error = message;
        }
      })
      .catch((err) => {
        this.error = err;
        console.log(err);
      });
  },
  data: function () {
    return {
      error: "",
      years: [],
      map: {},
    };
  },
  methods: {
    typeByMintAndYear(mint, year) {
        console.log(year)
        console.log(this.map[mint].values())
      return this.map[mint].has(year.toString());
    },
  },
  computed: {
    mints: function () {
      return Object.keys(this.map);
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  font-size: 10px;
}

.color-box {
    width: 20px;
    height: 20px;
    background-color: red;

    font-weight: bold;
    text-transform: uppercase;
    color: white;

    &.exists {
        background-color: green;
    }
}

</style>