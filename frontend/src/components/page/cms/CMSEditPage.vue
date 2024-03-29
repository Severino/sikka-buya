<template>
  <div class="page cms-page">
    <section class="content-wrapper">
      <h2>
        <Locale :path="`cms.${this.group}`" />
      </h2>

      <template v-show="!loading">
        <div
          class="info grid col-3"
          v-if="showTime"
        >
          <div class="cell">
            <label for="">Erstellt am</label>
            {{ timeMixinFormatDate(page.createdTimestamp) }}
          </div>
          <div class="cell">
            <label for="">Zuletzt geändert am</label>
            {{ timeMixinFormatDate(page.modifiedTimestamp) }}
          </div>
          <div class="cell">
            <label for="">Veröffentlicht am</label>
            {{ timeMixinFormatDate(page.publishedTimestamp) }}
          </div>
        </div>
        <h1
          :contenteditable="editmode"
          @input="update"
          @paste="update"
          data-property="title"
          v-show="isPresent('title')"
          ref="title"
          v-once
        >
          {{ page.title }}
        </h1>

        <h2
          class="subtitle"
          v-show="hasSubtitle"
          :contenteditable="editmode"
          @input="update"
          @paste="update"
          data-property="subtitle"
          ref="subtitle"
          v-once
        >
          {{ page.subtitle }}
        </h2>

        <p
          v-show="!editmode"
          name=""
          id=""
          cols="30"
          rows="10"
        ></p>
        <SimpleFormattedField
          ref="body"
          :allowLinks="allowLinks"
          @hook:mounted="() => selfInitialize('body')"
          @input="(value) => this.updateFormattedField('body', value)"
          v-show="editmode"
        />

        <!-- <section v-if="hasBlocks">
        <h2>Blocks</h2>

        <textarea
          v-for="block of   page.blocks"
          class="page-block"
          :contenteditable="editmode"
          @keydown="($event) => handleSpecialKeys($event, block)"
          @input="($event) => updateBlockText($event, block)"
          :key="`page-block-${block.id}`"
          :ref="`page-block-${block.id}`"
          v-model="block.text"
        />
        <div class="content-wrapper">
          <async-button @click="addEmptyBlock()">Add</async-button>
        </div>
      </section> -->
      </template>
      <div class="toolbar">
        <div class="toolbar-inner content-wrapper">
          <CMSStatusIndicator
            :dirty="dirty"
            :pending="saving"
          />
          <AsyncButton
            v-if="editmode"
            @click="save()"
            :loading="saving"
            :disabled="saving || !dirty"
          >
            Speichern
          </AsyncButton>
          <!-- <AsyncButton
            v-else
            @click="editmode = true"
            :loading="loading"
            :disabled="loading"
          >
            Bearbeiten
          </AsyncButton> -->

        </div>
      </div>

    </section>
  </div>
</template>

<script>
import Query from '../../../database/query';
import CMSPage from '../../../models/CMSPage';
import AsyncButton from '../../layout/buttons/AsyncButton.vue';
import CMSStatusIndicator from './CMSStatusIndicator.vue';
import SimpleFormattedField from '../../forms/SimpleFormattedField.vue';

import CMSConfig from '../../../../cms.config';
import Locale from '../../cms/Locale.vue';

import TimeMixin from '../../mixins/time';
import CopyAndPasteMixin from '../../mixins/copy-and-paste';
import MountedAndLoadedMixin from '../../mixins/mounted-and-loaded';
import LoadingSpinner from '../../misc/LoadingSpinner.vue';



export default {
  components: { CMSStatusIndicator, AsyncButton, SimpleFormattedField, Locale, LoadingSpinner },
  mixins: [TimeMixin, MountedAndLoadedMixin, CopyAndPasteMixin],
  mounted() {
    CMSPage.get(this.id)
      .then((page) => {
        this.page = Object.assign({}, this.page, page);
        this.implementedFields.forEach(this.selfInitialize);
      })
      .finally(() => {
        this.loading = false;
        this.isLoaded();
      });

    this.$nextTick(() => {
      this.implementedContenteditableRefs.forEach(ref => {
        console.log(ref);
        this.initPastePlainText
      })
    })
  },
  beforeDestroy() {
    [this.$refs["title"], this.$refs["subtitle"]].forEach(this.cleanupPastePlainText)
  },
  beforeRouteLeave(to, from, next) {
    if (this.dirty) {
      const answer = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      return answer;
    } else next()
  },
  props: {
    useBlocks: Boolean,
    group: String,
    include: {
      type: Array,
      default: () => [],
    },
    exclude: {
      type: Array,
      default: () => [],
    },

  },
  data() {
    return {
      dirty: false,
      updateBuffer: null,
      allowLinks: true,
      loading: true,
      saving: false,
      editmode: true,
      page: {
        title: null,
        subtitle: null,
        summary: null,
        body: null,
        image: null,
        createdTimestamp: null,
        publishedTimestamp: null,
        modifiedTimestamp: null,
        blocks: [],
      },
    };
  },
  methods: {
    selfInitialize(name) {
      if (!this.$refs[name]) console.error(`There is no ref with name ${name}`);
      else {
        if (this.$refs[name]._isVue)
          if (this.$refs[name].$options.name === 'SimpleFormattedField')
            this.$refs[name].setContent(this.page[name]);
          else throw new Error('Not implemented yet')
        else {
          this.$refs[name].innerHTML = this.page[name];
        }
      }
    },
    isPresent(name) {
      const configsFileInclude = CMSConfig[this.group]?.include || [];
      const componentInclude = this.include || [];
      let include = [...configsFileInclude, ...componentInclude];

      if (include.length > 0) {
        return include.includes(name);
      }

      return true;
    },
    async handleSpecialKeys($event, block) {
      if ($event.key === 'Enter') {
        $event.preventDefault();
        $event.stopPropagation();
      }

      if ($event.key === 'Backspace') {
        const target = $event.currentTarget;
        const value = target.textContent || target.value;
        if (value === '') {
          await Query.raw(
            `
          mutation DeleteBlock($id:ID!){deleteBlock(id: $id)}
        `,
            { id: block.id },
            true
          );

          const idx = this.page.blocks.findIndex(
            (otherBlock) => block.id === otherBlock.id
          );

          this.$delete(this.page.blocks, idx);
        }
      }
    },
    updateBlockText($event, block) {
      block = Object.assign({}, block);
      const id = block.id;
      delete block.id;

      const target = $event.currentTarget;
      this.adjustHeight(target);

      block.text = target.value;

      this.saving = true;
      this.updateBuffer.update(block, async () => {
        await Query.raw(
          `
        mutation UpdatePageBlock($id: ID!, $block: PageBlockInput){
          updateBlock(id: $id, block: $block)
          }
        `,
          { id, block }
        );
        this.saving = false;
      });
    },
    adjustHeight(target) {
      const targetHeight =
        target.scrollHeight >= target.clientHeight
          ? target.scrollHeight + 'px'
          : '60px';

      target.style.height = targetHeight;
    },
    updateFormattedField(property, value) {
      this.page[property] = this.$refs[property].getContent();
      this.dirty = true;
    },
    update($event) {
      const target = $event.currentTarget;
      const property = target.getAttribute('data-property');
      if (!property)
        throw new Error(`Attribute 'data-property' is missing on component!`);
      else {
        if (target.hasAttribute('contenteditable')) {
          this.page[property] = target.innerHTML;

        } else {
          this.page[property] = target.value;
        }
      }

      this.dirty = true;
    },
    async save() {
      const page = {
        title: this.page.title,
        subtitle: this.page.subtitle,
        summary: this.page.summary,
        body: this.page.body,
        image: this.page.image,
        createdTimestamp: this.page.createdTimestamp,
        publishedTimestamp: this.page.publishedTimestamp,
        modifiedTimestamp: this.page.modifiedTimestamp,
      };

      this.saving = true;
      await CMSPage.update(this.id, page);
      await (async function (ts) {
        return new Promise(resolve => setTimeout(resolve, ts))
      })(3000)
      this.dirty = false;
      this.saving = false;
    },
    async addEmptyBlock() {
      const position = 10;
      const group = 'empty';
      const result = await Query.raw(
        `
mutation CreatePageBlock($id: ID!, $group:String!, $position: Int!) {
  createBlock(parent: $id, block: {group: $group, position: $position})
}

      `,
        {
          id: this.id,
          position,
          group,
        },
        true
      );

      const id = result.data.data.createBlock;
      const block = {
        id,
        group,
        position,
        image: null,
        text: '',
        parent: null,
        page: this.id,
      };
      let i = 0;
      while (
        i < this.page.blocks.length &&
        position <= this.page.blocks[i].position
      ) {
        i++;
      }

      this.page.blocks.splice(i, 0, block);
      this.$forceUpdate();
    },
  },
  computed: {
    implementedContenteditableRefs() {
      return this.implementedContenteditables.map(name => this.$refs[name])
    },
    implementedContenteditables() {
      return ['title', 'subtitle']
    },
    implementedFields(){
      return ['title', 'subtitle', 'body']
    },
    id() {
      return this.$route.params.id;
    },
    showTime() {
      return Boolean(CMSConfig?.[this.group]?.page?.showTime);
    },
    hasBody() {
      return (
        this.isPresent('body') && (this.editmode || this.page.subtitle != '')
      );
    },
    hasSubtitle() {
      return (
        this.isPresent('subtitle') &&
        (this.editmode || this.page.subtitle != '')
      );
    },
    hasBlocks() {
      return (
        this.useBlocks &&
        this.isPresent('blocks') &&
        (this.editmode || (this.page.blocks && this.page.blocks.length > 0))
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: $light-gray;
  padding: $padding;
  box-shadow: 0 0 $shadow-spread $strong-shadow-color;

  >* {

    display: flex;
    flex-direction: row-reverse;
  }
}

.page {
  margin-bottom: $page-bottom-spacing;
}

h1 {
  margin-top: 1rem;
}

.info {
  margin-top: 1rem;
}

*[contenteditable],
input,
textarea {
  border: none;
  display: block;
  width: 100%;
  resize: none;
  padding: 0.3rem;
  background-color: $dark-white;
  border-radius: $border-radius;
  box-shadow: inset $shadow;
  box-sizing: border-box;
}

.page-block {
  margin: 1rem 0;
}
</style>