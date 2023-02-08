<template>
  <div class="page">
    <section class="content-wrapper">
      <header>
        <h1>News</h1>
        <async-button
          v-if="$store.getters.loggedIn"
          @click="createPageAndRedirect"
          >Neue Seite Erstellen</async-button
        >
      </header>
      <div class="grid col-3">
        <div class="article" v-for="page of pages" :key="`page-${page.id}`">
          <h2>{{ page.title }}</h2>
          <h3 class="subtitle">{{ page.subtitle }}</h3>
          <div>
            <label for="">Erstellt am:</label>
            <p>{{ timeMixinFormatDate(page.createdTimestamp) }}</p>
          </div>
          <p>{{ page.body }}</p>
          <router-link :to="{ name: 'NewsPage', params: { id: page.id } }"
            >Weiterlesen</router-link
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Query from '../../database/query';
import AsyncButton from '../layout/buttons/AsyncButton.vue';
import TimeMixin from '../mixins/time';
export default {
  components: { AsyncButton },
  mixins: [TimeMixin],
  data() {
    return {
      pages: [],
    };
  },
  created() {
    this.fetchPages();
  },
  methods: {
    createPageAndRedirect: async function () {
      const id = await Query.raw(
        `mutation{createPage(title:"_Unnamed", type:"news")}`
      );
    },
    fetchPages: async function () {
      const result = await Query.raw(`{getPageList(type: "news") {
  id
  title
  subtitle
  createdTimestamp
  body
} }`);

      this.pages = result.data.data.getPageList;

      console.log(this.pages);
    },
  },
};
</script>

<style>
</style>