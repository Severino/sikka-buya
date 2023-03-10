<template>
  <div class="page cms-page">
    <section class="content-wrapper" v-if="!loading">
      <h2>{{ $t(`cms.${this.group}`) }}</h2>
      <div class="info grid col-3" v-if="showTime">
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
        @input="($event) => update($event, 'title')"
        data-property="title"
        v-if="isPresent('title')"
        v-once
      >
        {{ page.title }}
      </h1>

      <h2
        class="subtitle"
        v-if="hasSubtitle"
        :contenteditable="editmode"
        @input="update"
        data-property="subtitle"
        v-once
      >
        {{ page.subtitle }}
      </h2>

      <p v-if="!editmode" name="" id="" cols="30" rows="10"></p>
      <SimpleFormattedField
        ref="body"
        @hook:mounted="() => selfInitialize('body')"
        @input="(value) => this.updateFormattedField('body', value)"
        v-else
      />

      <section v-if="hasBlocks">
        <h2>Blocks</h2>

        <textarea
          v-for="block of page.blocks"
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
      </section>
    </section>
    <CMSStatusIndicator :saving="saving" />
  </div>
</template>

<script>
import Query from '../../../database/query';
import CMSPage from '../../../models/CMSPage';
import RequestBuffer from '../../../models/request-buffer';
import AsyncButton from '../../layout/buttons/AsyncButton.vue';
import CMSStatusIndicator from './CMSStatusIndicator.vue';
import SimpleFormattedField from '../../forms/SimpleFormattedField.vue';

import TimeMixin from '../../mixins/time';
import MountedAndLoadedMixin from '../../mixins/mounted-and-loaded';
import CMSConfig from '../../../../cms.config';

export default {
  components: { CMSStatusIndicator, AsyncButton, SimpleFormattedField },
  mixins: [TimeMixin, MountedAndLoadedMixin],
  mounted() {
    CMSPage.get(this.id)
      .then((page) => {
        this.page = Object.assign({}, this.page, page);
      })
      .finally(() => {
        this.loading = false;
        this.isLoaded();
      });

    this.updateBuffer = new RequestBuffer(3000, true);
  },
  props: {
    group: String,
    include: {
      type: Array,
      defaultValue: [],
    },
  },
  data() {
    return {
      updateBuffer: null,
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
        this.$refs[name].setContent(this.page[name]);
      }
    },
    isPresent(name) {
      const configsFileInclude = CMSConfig[this.group]?.include || [];
      const componentInclude = this.include || [];
      let include = [...configsFileInclude, ...componentInclude];

      if (include != []) {
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
      const comptutedStyle = window.getComputedStyle(target);
      const paddingTop = comptutedStyle.getPropertyValue('padding-top');
      const paddingBottom = comptutedStyle.getPropertyValue('padding-bottom');

      // const actualHeight =
      //   target.scrollHeight - parseInt(paddingTop) - parseInt(paddingBottom);

      // console.log(target.scrollHeight, target.offsetHeight);

      const targetHeight =
        target.scrollHeight >= target.clientHeight
          ? target.scrollHeight + 'px'
          : '60px';

      target.style.height = targetHeight;
    },
    // adjustHeightCss(ref) {
    //   let target = this.$refs[ref];

    //   if (target) {
    //     target = target[0];
    //     const height = this.adjustHeight(target);
    //     console.log(height);
    //     return { height };
    //   }
    //   return {};
    // },
    updateFormattedField(property, value) {
      this.page[property] = this.$refs[property].getContent();
      this.save();
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
      this.save();
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
      this.updateBuffer.update(page, () => {
        CMSPage.update(this.id, page);
        this.saving = false;
      });
    },
    async addEmptyBlock() {
      const position = 10;
      const type = 'empty';
      const result = await Query.raw(
        `
mutation CreatePageBlock($id: ID!, $type:String!, $position: Int!) {
  createBlock(parent: $id, block: {type: $type, position: $position})
}

      `,
        {
          id: this.id,
          position,
          type,
        },
        true
      );

      const id = result.data.data.createBlock;
      const block = {
        id,
        type,
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
    id() {
      return this.$route.params.id;
    },
    showTime() {
      return Boolean(CMSConfig?.['bibliography']?.page?.showTime);
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
        this.isPresent('blocks') &&
        (this.editmode || (this.page.blocks && this.page.blocks.length > 0))
      );
    },
  },
};
</script>

<style lang="scss" scoped>
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