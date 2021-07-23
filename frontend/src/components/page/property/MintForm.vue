<template>
  <div class="mint-form">
    <PropertyFormWrapper
      @submit="submit"
      @cancel="cancel"
      :loading="loading"
      property="mint"
      :title="$tc('property.mint')"
      :error="error"
    >
      <input v-model="mint.id" type="hidden" />
      <input
        type="text"
        v-model="mint.name"
        :placeholder="$tc('attribute.name')"
        autofocus
        required
      />

      <label for="location">Location</label>
      <location-input
        id="location"
        type="point"
        :coordinates="mint.location.coordinates"
        @update="updateLocation"
      />

      <div id="uncertain-row">
        <Checkbox
          id="location_uncertain"
          v-model="mint.uncertain"
          :label="$t('property.uncertain_location') + '(?)'"
        />
      </div>

      <div v-if="mint.uncertain">
        <label for="location">Geschätzte Verortung</label>
        <location-input
          type="polygon"
          :coordinates="mint.uncertainLocation.coordinates"
          @update="updateUncertainLocation"
        />
      </div>
    </PropertyFormWrapper>
  </div>
</template>

<script>
import Query from "../../../database/query.js";
import PropertyFormWrapper from "../PropertyFormWrapper.vue";
import Checkbox from "../../forms/Checkbox";
import LocationInput from "../../forms/LocationInput.vue";
import GraphQLUtils from "../../../utils/GraphQLUtils.js";

export default {
  components: {
    Checkbox,
    PropertyFormWrapper,
    LocationInput,
  },
  name: "MintForm",
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      Query.raw(
        `    {
                getMint (id:${id})  {
                    id,
                    name,
                    location {
                      type,
                      coordinates
                    },
                    uncertain,
                    uncertainLocation {
                      type,
                      coordinates
                    }
                }
              }
      `
      )
        .then((result) => {
          let data = result.data.data.getMint;
          console.log(data.uncertainLocation?.type);

          if (data.uncertainLocation?.type.toLowerCase() == "polygon") {
            console.log("HELLO");
            let coords = [];
            for (
              let i = 0;
              i < data.uncertainLocation.coordinates.length - 1;
              i += 2
            ) {
              coords.push([
                data.uncertainLocation.coordinates[i],
                data.uncertainLocation.coordinates[i + 1],
              ]);
            }
            data.uncertainLocation.coordinates = coords;
          }

          console.log(data.uncertainLocation);

          this.mint = data;
        })
        .catch((err) => {
          this.$data.error = this.$t("error.loading_element");
          console.log(err);
        })
        .finally(() => {
          this.$data.loading = false;
        });
    } else {
      this.$data.loading = false;
    }
  },
  methods: {
    submit: function () {
      let { type, coordinates } = this.mint.uncertainLocation;
      coordinates = this.mint?.uncertainLocation?.coordinates
        ? (coordinates = coordinates.flatMap((point) => [point[0], point[1]]))
        : null;

      let data = {
        uncertain: this.mint.uncertain,
        name: this.mint.name,
        location: this.mint.location,
        uncertainLocation: { type, coordinates },
      };

      if (this.mint.id == -1) {
        this.query("addMint", data);
      } else {
        data.id = this.mint.id;
        this.query("updateMint", data);
      }
    },
    radiusChanged: function (radius) {
      this.radius = parseInt(radius);
    },
    query: function (name, data = {}) {
      console.log(GraphQLUtils.buildMutationParams(data));

      const body = GraphQLUtils.buildMutationParams(data);
      const query = `mutation {${name}(data: ${body})}`;
      Query.raw(query)
        .then(() => {
          this.$router.push({
            name: "Property",
            params: { property: "mint" },
          });
        })
        .catch((err) => {
          this.error = this.$t("error.could_not_update_element");
          console.error(err);
        });
    },
    cancel: function () {
      this.$router.push({ path: "/mint" });
    },
    updateLocation: function (geoJson) {
      this.mint.location = geoJson;
    },
    updateUncertainLocation: function (geoJson) {
      this.mint.uncertainLocation = geoJson;
    },
  },
  data: function () {
    return {
      error: "",
      loading: true,
      radius: 1000,
      mint: {
        id: -1,
        name: "",
        uncertain: false,
        location: {
          type: "empty",
          coordinates: [],
        },
        uncertainLocation: {
          type: "empty",
          coordinates: [],
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
#uncertain-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
</style>
