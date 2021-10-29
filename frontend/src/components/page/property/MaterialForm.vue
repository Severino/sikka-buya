<template>
  <div class="material-form">
    <PropertyFormWrapper
      @submit="submit"
      @cancel="cancel"
      :loading="loading"
      property="material"
      :title="$tc('property.material')"
      :error="error"
    >
      <input v-model="material.id" type="hidden" />
      <input
        type="text"
        v-model="material.name"
        :placeholder="$tc('attribute.name')"
        autofocus
        required
      />

      <div v-for="(obj, key) of languages" :key="'mint-' + key">
        <div class="label">{{ key }}</div>
        <input v-model="obj.name" />
      </div>
    </PropertyFormWrapper>
  </div>
</template>

<script>
import Query from '../../../database/query.js';
import PropertyFormWrapper from '../PropertyFormWrapper.vue';

export default {
  components: { PropertyFormWrapper },
  name: 'MaterialForm',
  created: function() {
    let id = this.$route.params.id;
    if (id != null) {
      Query.raw(
        `{
        getMaterial(id: ${id}){id name}
        getLang (id: ${id},
    table: "material",
    lang: "en",
    attr: "name"
  )
      }`
      )
        .then(result => {
          this.material = result.data.data.getMaterial;
          const lang = result.data.data.getLang;
          if (lang) {
            console.log(lang);
            this.languages = { en: { name: lang } };
          }
        })
        .catch(err => {
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
    submit: function() {
      let langs = [];
      for (let [langId, langObj] of Object.entries(this.languages)) {
        console.log(langId, langObj);
        for (let [key, val] of Object.entries(langObj)) {
          langs.push(
            `updateLang(id:${this.material.id}, table: "material", lang: "${langId}", attr: "${key}", value: "${val}" )`
          );
        }
      }
      langs.join('\n');

      Query.raw(
        `
      mutation{
        updateMaterial(data: {id: ${this.material.id}, name: "${this.material.name}" })
        ${langs}
        
      }
      `
      )
        .then(() => {
          this.$router.push({
            name: 'Property',
            params: { property: 'material' }
          });
        })
        .catch(err => {
          this.error = err.join('\n');
        });
    },
    cancel: function() {
      this.$router.push({ path: '/material' });
    }
  },
  data: function() {
    return {
      error: '',
      loading: true,
      languages: {
        en: {
          name: ''
        }
      },
      material: { id: -1, name: '' }
    };
  }
};
</script>
