<template>
  <div class="locale-form">
    <h1>Locale</h1>
    <header>
      <strong>{{ lang }}</strong>
      <input type="text" v-model="path" />
    </header>

    <InputWithReset
      type="text"
      name="singular"
      v-model="singular"
      placeholder="singular"
      @reset="reset('singular')"
    />
    <InputWithReset
      type="text"
      name="plural"
      v-model="plural"
      @reset="reset('plural')"
    />
    <Button @click="submit">Anwenden</Button>
  </div>
</template>

<script>
import Query from '../../../database/query';
import I18n from '../../../i18n/i18n';
import InputWithReset from '../../forms/InputWithReset.vue';

export default {
  components: {
    InputWithReset,
  },
  data() {
    return {
      path: '',
      singular: '',
      plural: ',',
      submitting: false,
    };
  },
  mounted() {
    this.init();
    addEventListener('keydown', this.submitWithEnter);
  },
  beforeDestroy() {
    removeEventListener('keydown', this.submitWithEnter);
  },
  beforeRouteUpdate(to, from, next) {
    this.init(to);
    next();
  },
  methods: {
    init(route = null) {
      if (!route) route = this.$route;
      this.path = route.params.path || '';
      if (this.path) {
        let val = this.$t(this.path);
        let names = val.split('|').map((el) => el.trim());
        this.singular = names[0] || '';
        this.plural = names[1] || '';
      }
    },
    reset(target) {
      const count = target === 'plural' ? 2 : 1;
      this.$data[target] = this.$tc(this.path, count);
    },
    submitWithEnter(e) {
      if (e.key === 'Enter') this.submit();
    },
    async submit(e) {
      if (!this.submitting) {
        this.submitting = true;
        try {
          console.log({ singular: this.singular, plural: this.plural });
          await Query.raw(
            `mutation SetLangAttribute($path: String!, $lang:String!, $singular: String!, $plural: String) {
                setLang(path: $path, lang: $lang, singular: $singular, plural: $plural)
            }`,
            {
              path: this.path,
              lang: this.lang,
              singular: this.singular === '' ? null : this.singular,
              plural: this.plural === '' ? null : this.plural,
            }
          );

          await I18n.reload(this.$root);
          this.$router.go(-1);
        } catch (e) {
          this.$store.commit('printError', e);
        }
        this.submitting = false;
      } else {
        this.$store.comit('printError', this.$tc('error.already_submitted'));
      }

      return false;
    },
  },
  computed: {
    lang() {
      return this.$route.params.lang;
    },
  },
};
</script>

<style lang='scss' scoped>
.locale-form > * {
  display: block;
  display: flex;
  margin-bottom: $padding;
  gap: $padding;
  align-items: center;
}
</style>