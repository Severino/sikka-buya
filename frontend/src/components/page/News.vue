<template>
  <div class="news">
    <header>
      <h1>
        <locale path="cms.news" />
      </h1>
      <async-button
        class="create-page-button"
        v-if="$store.getters.canEdit"
        @click="() => cms_createAndVisit('news', { include: ['title', 'body'] })"
      >
        <locale path="cms.create_page" />
      </async-button>
    </header>
    <div>
      <article
        v-for="page of pages"
        :key="`page-${page.id}`"
      >
        <h2 :class="getPageTitleClass(page)">{{ getPageTitle(page) }}</h2>
        <div class="time-row">
          <span class="time">{{
            timeMixinFormatDate(page.publishedTimestamp)
          }}</span>
          <multi-button
            class="toolbox"
            v-if="$store.getters.canEdit"
          >
            <Button
              @click="publish(page)"
              :disabled="loading"
            >
              <locale path="general.publish" />
            </Button>
            <Button
              :to="{ name: 'NewsPage', params: { id: page.id } }"
              :disabled="loading"
            >
              <locale path="general.edit" />
            </Button>
          </multi-button>
        </div>

        <p>{{ page.body }}</p>
      </article>
    </div>
  </div>
</template>

<script>
import Query from '../../database/query';
import AsyncButton from '../layout/buttons/AsyncButton.vue';
import Button from '../layout/buttons/Button.vue';
import TimeMixin from '../mixins/time';
import PencilCircle from 'vue-material-design-icons/PencilCircle.vue';
import MultiButton from '../layout/buttons/MultiButton.vue';
import CMSPage from '../../models/CMSPage';
import CMSMixin from '../mixins/cms';
import Locale from '../cms/Locale.vue';
export default {
  components: { AsyncButton, Button, PencilCircle, MultiButton, Locale },
  mixins: [TimeMixin, CMSMixin],
  data() {
    return {
      pages: [],
      loading: false,
    };
  },
  created() {
    this.fetchPages();
  },
  methods: {
    async publish(page) {
      page.publishedTimestamp = Date.now().toString();
      this.loading = true;
      await CMSPage.update(page.id, page);
      await this.fetchPages();
      this.loading = false;
    },
    getPageTitleClass(page) {
      if (!page.title) return 'errorous';
      else return '';
    },
    getPageTitle(page) {
      return page.title || 'TITEL FEHLT';
    },
    createPageAndRedirect: async function () {
      const result = await CMSPage.create("news")
      CMSPage.ed
    },
    fetchPages: async function () {
      const result = await Query.raw(`{getPageList(type: "news") {
  id
  title
  subtitle
  createdTimestamp
  publishedTimestamp 
  body
} }`);

      this.pages = result.data.data.getPageList;
    },
  },
};
</script>

<style lang="scss">
.news {
  article {
    display: flex;
    flex-direction: column;
  }

  .toolbox {
    align-self: flex-end;

    label {
      font-size: $small-font;
    }
  }
}
</style>

<style lang="scss" scoped>
h2 {
  margin-bottom: 0.5rem;
}

p {
  margin: 0.5rem 0;
}

header {
  position: relative;
}

article {
  position: relative;
}

.time-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.errorous {
  color: $red;
}

.create-page-button {
  position: absolute;
  top: 0;
  right: 0;
  color: $primary-color;
}</style>