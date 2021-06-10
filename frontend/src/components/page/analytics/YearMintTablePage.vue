<template>
  <div class="page">
    <h1>Münzstätten / Jahr Tabelle</h1>
    <div v-if="error" class="error"></div>
    <table>
      <thead>
        <tr>
          <td></td>
          <td v-for="mint in mints" :key="'head-' + mint">{{ mint }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(year, idx) in sortedYears" :key="'row-' + idx">
          <td>{{ year }}</td>
          <td
            v-for="mint in mints"
            :key="'col-' + idx + '-' + mint"
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
        let data =
          result && result.data && result.data.data && result.data.data.getTypes
            ? result.data.data.getTypes
            : null;
        if (data) {
          let map = {};
          let years = new Set();

          data.forEach((d) => {
            if (d.mint !== null && d.mint.name !== null) {
              const mint = d.mint.name;
              const year = d.yearOfMinting;
              if (!map[mint]) map[mint] = new Set();
              map[mint].add(year);

              let numYear = parseInt(year);
              if (numYear) {
                years.add(numYear);
              } else console.error("Year is no number", year);
            }
          });

          // Max Gap must be x >= 2
          const maxGap = 5;
          const values = years.values();

          let yearArray = Array.from(values).sort();
          let yearWithGapsArray = [];

          if (yearArray.length > 0) {
            for (let i = 0; i <= yearArray.length - 1; i++) {
              // if(year == 123) continue
              const year = yearArray[i];
              yearWithGapsArray.push(year);
              let nextYear = yearArray[i + 1];

              let gap = nextYear - year;
              if (gap > maxGap) {
                yearWithGapsArray.push(
                  `${year + 1} ... ${nextYear - 1} (${nextYear - year - 2})`
                );
              } else {
                for (let j = parseInt(year) + 1; j < nextYear; j++) {
                  if (j == 125) console.error("DANGER", year, nextYear);
                  yearWithGapsArray.push(j);
                }
              }
            }
            yearWithGapsArray.push(yearArray[yearArray.length - 1]);
          }

          this.years = yearWithGapsArray;
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
    sortedYears: function () {
      return Array.from(this.years).sort();
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 1em;
}
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  padding: 3em 0;

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