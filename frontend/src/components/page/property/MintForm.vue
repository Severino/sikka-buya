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

      <DataSelectField
        table="Province"
        attribute="name"
        v-model="mint.province"
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
          @update="updateUncertainArea"
        />
      </div>
    </PropertyFormWrapper>
  </div>
</template>

<script>
import Query from '../../../database/query.js';
import PropertyFormWrapper from '../PropertyFormWrapper.vue';
import Checkbox from '../../forms/Checkbox';
import LocationInput from '../../forms/LocationInput.vue';
import GraphQLUtils from '../../../utils/GraphQLUtils.js';
import DataSelectField from '../../forms/DataSelectField.vue';

export default {
  components: {
    Checkbox,
    PropertyFormWrapper,
    LocationInput,
    DataSelectField,
  },
  name: 'MintForm',
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      Query.raw(
        `    {
                getMint (id:${id})  {
                    id,
                    name,
                    province {
                      id, name
                    }
                    location 
                    uncertain,
                    uncertainArea
                }
              }
      `
      )
        .then((result) => {
          let data = result.data.data.getMint;

          let locations = ['location', 'uncertainArea'];

          locations.forEach((locationProperty) => {
            if (data[locationProperty]) {
              try {
                data[locationProperty] = JSON.parse(data[locationProperty]);
              } catch (e) {
                console.error(
                  `Could not parse ${locationProperty}. This should never happen, contact a developer!`
                );
                data[locationProperty] = null;
              }
            }
          });

          if (!data.location) {
            data.location = {
              type: 'Point',
              coordinates: null,
            };
          }

          if (!data.uncertainArea) {
            data.uncertainArea = {
              type: 'Polygon',
              coordinates: [[[]]],
            };
          }

          if (data.uncertainArea?.type.toLowerCase() == 'polygon') {
            let coords = [];
            for (
              let i = 0;
              i < data.uncertainArea.coordinates.length - 1;
              i += 2
            ) {
              coords.push([
                data.uncertainArea.coordinates[i],
                data.uncertainArea.coordinates[i + 1],
              ]);
            }
            data.uncertainArea.coordinates = coords;
          }

          console.log(data.uncertainArea);

          this.mint = data;
        })
        .catch((err) => {
          console.log('asdasd');
          this.$data.error = this.$t('error.loading_element');
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
      let { type, coordinates } = this.mint.uncertainArea;
      coordinates = this.mint?.uncertainArea?.coordinates
        ? (coordinates = coordinates.flatMap((point) => [point[0], point[1]]))
        : null;

      let data = {
        uncertain: this.mint.uncertain,
        name: this.mint.name,
        location: this.mint.location,
        uncertainArea: { type, coordinates },
      };

      if (this.mint.id == -1) {
        this.query('addMint', data);
      } else {
        data.id = this.mint.id;
        this.query('updateMint', data);
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
            name: 'Property',
            params: { property: 'mint' },
          });
        })
        .catch((err) => {
          this.error = this.$t('error.could_not_update_element');
          console.error(err);
        });
    },
    cancel: function () {
      this.$router.push({ path: '/mint' });
    },
    updateLocation: function (geoJson) {
      this.mint.location = geoJson;
    },
    updateUncertainArea: function (geoJson) {
      this.mint.uncertainArea = geoJson;
    },
  },
  data: function () {
    return {
      error: '',
      loading: true,
      radius: 1000,
      mint: {
        id: -1,
        name: '',
        uncertain: false,
        location: {
          type: 'empty',
          coordinates: [],
        },
        uncertainArea: {
          type: 'empty',
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
