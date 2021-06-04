<template>
  <div class="page">
    <div v-if="error" class="error"></div>
    <table>
      <thead>
        <tr>
          <td></td>
          <td v-for="mint in mints" :key="'head-' + mint">{{ mint }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="year in years" :key="'row-' + year">
          <td>{{ year }}</td>
          <td
            v-for="mint in mints"
            :key="'col-' + year + '-' + mint"
            class="color-box"
            :class="{ exists: typeByMintAndYear(mint, year) }"
          >
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
        console.log(result);
        let data =
          result && result.data && result.data.data && result.data.data.getTypes
            ? result.data.data.getTypes
            : null;
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
      return this.map[mint].has(year.toString());
    },
  },
  computed: {
    mints: function () {
      return Object.keys(this.map).sort((a, b) => b < a);
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

  // font-size: 10px;
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

td {
  text-align: center;
  min-width: 72px;
}
</style>