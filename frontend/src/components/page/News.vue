<template>
  <div>
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
        <article v-for="page of pages" :key="`page-${page.id}`">
          <Button :to="{ name: 'NewsPage', params: { id: page.id } }"
            ><PencilCircle :size="IconSize.Huge"
          /></Button>
          <h2 :class="getPageTitleClass(page)">{{ getPageTitle(page) }}</h2>
          <h3 class="subtitle">{{ page.subtitle }}</h3>
          <div>
            <label for="">Erstellt am:</label>
            <p>{{ timeMixinFormatDate(page.createdTimestamp) }}</p>
          </div>
          <p>{{ page.body }}</p>
          <router-link :to="{ name: 'NewsPage', params: { id: page.id } }"
            >Weiterlesen</router-link
          >
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import Query from '../../database/query';
import AsyncButton from '../layout/buttons/AsyncButton.vue';
import Button from '../layout/buttons/Button.vue';
import TimeMixin from '../mixins/time';
import PencilCircle from 'vue-material-design-icons/PencilCircle.vue';
export default {
  components: { AsyncButton, Button, PencilCircle },
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
    getPageTitleClass(page) {
      if (!page.title) return 'errorous';
      else return '';
    },
    getPageTitle(page) {
      return page.title || 'TITEL FEHLT';
    },
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

<style lang="scss" scoped>
article {
  position: relative;
}
article:first-of-type {
  grid-column: span 3;
}

.errorous {
  color: $red;
}

.button {
  position: absolute;
  background-color: transparent;
  border: none;
  top: 0;
  right: 0;
  color: $primary-color;
}
</style>