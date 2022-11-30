<template>
  <div class="material-form">
    <PropertyFormWrapper
      @submit="submit"
      overwriteRoute="MaterialOverview"
      :loading="loading"
      property="material"
      :title="$tc('property.material')"
      :error="error"
      :disabled="disabled"
    >
      <input id="material-id" v-model="material.id" type="hidden" />
      <input
        type="text"
        id="material-name"
        v-model="material.name"
        :placeholder="$tc('attribute.name')"
        autofocus
        required
      />

      <ColorInput
        v-if="material.id >= 0"
        id="material-color"
        :value="material.color"
        @input="input"
      />
    </PropertyFormWrapper>
  </div>
</template>

<script>
import Query from '../../../database/query.js';
import PropertyFormWrapper from '../PropertyFormWrapper.vue';
import ColorInput from '../../forms/ColorInput.vue';

export default {
  components: { PropertyFormWrapper, ColorInput },
  name: 'MaterialForm',
  created: function () {
    let id = this.$route.params.id;
    if (id != null) {
      Query.raw(
        `{
        getMaterial(id: ${id}){id name }
        getMaterialColor(id: ${id})
      }`
      )
        .then((result) => {
          this.material = Object.assign({}, result.data.data.getMaterial, {
            color: result.data.data.getMaterialColor,
          });
          if (this.material.id) this.disabled = false;
        })
        .catch((err) => {
          this.$data.error = this.$t('error.loading_element');
          console.error(err);
        })
        .finally(() => {
          this.$data.loading = false;
        });
    } else {
      this.disabled = false;
      this.$data.loading = false;
    }
  },
  methods: {
    input(color) {
      this.material.color = color;
    },
    submit: function () {
      let query;
      if (this.material.id && this.material.id >= 0) {
        query = `
      mutation{
        updateMaterial(id: ${this.material.id}, name: "${this.material.name}")
        ${
          this.material.color
            ? `updateMaterialColor(id: ${this.material.id}, color: "${this.material.color}")`
            : ''
        }
      }
      `;
      } else {
        query = `
      mutation{
        addMaterial( name: "${this.material.name}")
      }
      `;
      }

      Query.raw(query)
        .then(() => {
          this.$router.push({ name: 'MaterialOverview' });
        })
        .catch((err) => {
          this.error = err.join('\n');
        });
    },
  },
  data: function () {
    return {
      error: '',
      loading: true,
      material: { id: -1, name: '', color: null },
      disabled: true,
    };
  },
};
</script>
