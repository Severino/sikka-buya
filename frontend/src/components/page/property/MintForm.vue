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

      <labeled-input-container label="Notizen">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          maxlength="1300"
          v-model="note"
        ></textarea>
      </labeled-input-container>
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

export default {
  components: {
    Checkbox,
    PropertyFormWrapper,
    LocationInput,
    DataSelectField,
    LabeledInputContainer,
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
                getNote (property: "mint", propertyId:${id})
              }
      `
      )
        .then((result) => {
          let data = result.data.data.getMint;

          this.note = result.data.data.getNote;

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
  computed: {
    isUpdate() {
      console.log(this.mint.id);
      return !!this.mint?.id && this.mint.id > 0;
    },
  },
  methods: {
    submit: async function () {
      this.error = '';

      // There is one array missing in the input field.
      let { type, coordinates } = this.mint.uncertainArea;

      const location =
        !this.mint.location ||
        this.mint.location?.type == 'empty' ||
        this.mint.location.coordinates == null ||
        this.mint.location.coordinates.length < 2
          ? null
          : `${JSON.stringify(this.mint.location).replace(/"/g, "'")}`;

      const uncertainArea =
        !this.mint.uncertainArea ||
        this.mint.uncertainArea?.type == 'empty' ||
        this.mint.uncertainArea?.coordinates == null
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

      let id;
      if (this.mint.id == -1) {
        id = await this.query('addMint', data);
      } else {
        data.id = this.mint.id;
        id = await this.query('updateMint', data);
      }

      const query = `mutation UpdateNote($note:String, $id:ID!) {
        updateNote(text: $note, property:"mint", propertyId: $id)
        }`;

      await Query.raw(query, { note: this.note, id }).catch(
        (e) => (this.error += e)
      );

      if (!this.error) {
        this.$router.push({
          name: 'Property',
          params: { property: 'mint' },
        });
      }
    },
    radiusChanged: function (radius) {
      this.radius = parseInt(radius);
    },
    query: async function (name, data = {}) {
      const body = GraphQLUtils.buildMutationParams(data);
      console.log(body);
      const query = `mutation {
        ${name}(data: ${body}) 
        }`;
      let result = await Query.raw(query).catch((err) => {
        this.error = this.$t(err);
        console.error(err);
      });

      return result?.data.data[name];
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
      note: '',
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
