<template>
  <div class="mint-form">
    <notes
      v-if="data?.mint?.id"
      property="mint"
      :propertyId="$route.params.id"
    />
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

      <labeled-input-container :label="$tc('property.province')">
        <DataSelectField
          table="Province"
          attribute="name"
          v-model="mint.province"
        />
      </labeled-input-container>

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
          :coordinates="mint.uncertainArea.coordinates"
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
import LabeledInputContainer from '../../LabeledInputContainer.vue';
import Notes from '../../forms/Notes.vue';

export default {
  components: {
    Checkbox,
    PropertyFormWrapper,
    LocationInput,
    DataSelectField,
    LabeledInputContainer,
    Notes,
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
              coordinates: [[]],
            };
          }

          data.uncertainArea.coordinates = data.uncertainArea.coordinates[0];

          this.mint = data;
        })
        .catch((err) => {
          this.$data.error = this.$t('error.loading_element');
          console.error(err);
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
      // There is one array missing in the input field.
      let { type, coordinates } = this.mint.uncertainArea;
      // coordinates = this.mint?.uncertainArea?.coordinates
      //   ? (coordinates = coordinates.flatMap((point) => [point[0], point[1]]))
      //   : null;

      // console.log('coordinates', coordinates);

      const location =
        !this.mint.location ||
        this.mint.location?.type == 'empty' ||
        this.mint.location.coordinates == null ||
        this.mint.location.coordinates.length < 2
          ? null
          : `${JSON.stringify(this.mint.location).replace(/"/g, "'")}`;

      const uncertainArea =
        !this.mint.uncertainArea || this.mint.uncertainArea?.type == 'empty'
          ? null
          : `${JSON.stringify({
              type,
              coordinates: [coordinates],
            }).replace(/"/g, "'")}`;
      let data = {
        uncertain: this.mint.uncertain,
        name: this.mint.name,
        location,
        uncertainArea,
        province: this.mint.province?.id,
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
      console.log(geoJson);
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
      notes: '',
      mint: {
        id: -1,
        name: '',
        uncertain: false,
        province: {
          id: null,
          name: '',
        },
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
