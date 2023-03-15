<template>
  <div
    class="simple-formatted-field"
    @mouseenter="() => (this.active = true)"
    @mouseleave="() => (this.active = false)"
  >
    <Row class="toolbar" style="margin-bottom: 10px" v-if="this.active">
      <button type="button" @click.prevent="align('left')">
        <FormatAlignLeft :size="iconSize"/>
      </button>
      <button type="button" @click.prevent="align('center')">
        <FormatAlignCenter :size="iconSize"/>
      </button>
      <button type="button" @click.prevent="align('right')">
        <FormatAlignRight :size="iconSize"/>
      </button>
      <div class="spacer"></div>
      <button type="button" @click.prevent="formatRightToLeft">
        <TextRightToLeft :size="iconSize"/>
      </button>
      <button type="button" @click.prevent="clearFormat">
        <TextFormatClear :size="iconSize"/>
      </button>
      <button type="button" @click.prevent="formatLeftToRight">
        <TextLeftToRight :size="iconSize"/>
      </button>
      <div class="spacer"></div>
      <button type="button" @click.prevent="toggleBold">
        <FormatBold :size="iconSize"/>
      </button>
      <button type="button" @click.prevent="toggleCursive">
        <FormatItalic :size="iconSize"/>
      </button>
    </Row>

    <div
      ref="field"
      class="formatted-text-area"
      spellcheck="true"
      @input="input"
      contenteditable
    ></div>
    <dynamic-delete-button @delete="setContent()" />
  </div>
</template>

<script>
import Row from '../layout/Row.vue';

import FormatAlignLeft from 'vue-material-design-icons/FormatAlignLeft';
import FormatAlignCenter from 'vue-material-design-icons/FormatAlignCenter';
import FormatAlignRight from 'vue-material-design-icons/FormatAlignRight';

import FormatBold from 'vue-material-design-icons/FormatBold';
import FormatItalic from 'vue-material-design-icons/FormatItalic';

import TextLeftToRight from 'vue-material-design-icons/FormatPilcrowArrowRight.vue';
import TextRightToLeft from 'vue-material-design-icons/FormatPilcrowArrowLeft.vue';
import TextFormatClear from 'vue-material-design-icons/FormatClear.vue';
import DynamicDeleteButton from '../layout/DynamicDeleteButton.vue';

import CopyAndPasteMixin from '../mixins/copy-and-paste';

export default {
  components: {
    Row,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatBold,
    FormatItalic,
    TextLeftToRight,
    TextRightToLeft,
    TextFormatClear,
    DynamicDeleteButton,
  },
  name: 'SimpleFormattedField',
  mixins: [CopyAndPasteMixin],
  data: function () {
    return {
      active: false,
      range: null,
      iconSize: 16
    };
  },
  mounted() {
    this.$refs.field.addEventListener('paste', this.pastePlainText);
  },
  onBeforeUnmount() {
    this.$refs.field.removeEventListener('paste', this.pastePlainText);
  },
  methods: {
    setContent: function (str) {
      if (!str) {
        str = '<div style="text-align: center;"><br></div>';
      }

      this.$refs.field.innerHTML = str;
    },
    getContent: function () {
      return this.$refs.field.innerHTML;
    },
    getSelected: function () {
      let node = document.getSelection().anchorNode;

      /**
       * Break when selection is outside this element.
       */
      if (this.$refs.field == node || !this.$refs.field.contains(node)) {
        return null;
      } else {
        while (node.parentNode != this.$refs.field) {
          node = node.parentNode;
        }

        if (
          node.nodeType == 3 ||
          (node.nodeType == 1 && node.tagName.toLowerCase() !== 'div')
        ) {
          let textNode = node;
          node = document.createElement('div');
          textNode.parentNode.insertBefore(node, textNode);
          node.appendChild(textNode);
        }
      }

      return node;
    },
    formatSelection() {
      const parentNode = this.getSelected();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const parentTextContent = parentNode.textContent;
      let content = range.cloneContents();

      if (
        content.textContent === '' ||
        parentTextContent.trim() == content.textContent.trim()
      ) {
        return parentNode;
      } else {
        let content = range.extractContents();
        const span = document.createElement('span');
        span.appendChild(content);
        range.insertNode(span);

        return span;
      }
    },
    clearFormat() {
      const node = this.getSelected();
      node.innerHTML = node.textContent;
      node.removeAttribute('dir');
    },
    formatRightToLeft() {
      const span = this.formatSelection();
      span.setAttribute('dir', 'rtl');
    },
    formatLeftToRight() {
      const span = this.formatSelection();
      span.setAttribute('dir', 'ltr');
    },
    align: function (value) {
      const node = this.getSelected();
      if (node) {
        Object.assign(node.style, {
          textAlign: value,
        });
        this.$emit('input', this.$refs.field.innerHTML);
      }
    },
    toggleBold: function () {
      document.execCommand('bold', false, null);
      this.$emit('input', this.$refs.field.innerHTML);
    },
    toggleCursive: function () {
      document.execCommand('italic', false, null);
      this.$emit('input', this.$refs.field.innerHTML);
    },
    input: function (event) {
      const target = event.target;
      this.$emit('input', target.innerHTML);
    },

    /**
     * Thankfully taken from: https://gist.github.com/dantaex/543e721be845c18d2f92652c0ebe06aa
     */
    saveSelection: function () {
      if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          return sel.getRangeAt(0);
        }
      } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
      }
      return null;
    },
    restoreSelection: function (range) {
      if (range) {
        if (window.getSelection) {
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (document.selection && range.select) {
          range.select();
        }
      }
    },
  },
};
</script>

<style lang="scss">
.simple-formatted-field {
  position: relative;

  .dynamic-delete-button {
    position: absolute;
    bottom: 3px;
    right: 2px;
  }
}

.formatted-text-area {
  min-height: 1.5rem;

  [dir='ltr'],
  [dir='rtl'] {
    border: 1px solid gray;
    border-radius: 3px;
    margin: 1px;
    padding: 1px;

    &::before {
      position: absolute;
      font-size: 0.65rem;
      font-weight: bold;
      bottom: 0;
      transform: translateY(100%);
      background-color: gray;
      color: white;
      padding: 1px 3px;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }

  [dir='ltr'] {
    position: relative;

    &::before {
      content: '>>>';

      left: 0;
    }
  }

  [dir='rtl'] {
    position: relative;

    &::before {
      content: '>>>';

      right: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.toolbar {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
  background-color: $gray;
  margin-bottom: 0 !important;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  transform: translateY(-100%);

  button {
    border: none;
    margin-right: 2px;
  }

  .material-design-icon {
    color: $white;
  }

  > *:not(.spacer) {
    width: unset;
    margin: 0px 1px !important;
    padding: 0;
    padding-top: 3px;
    background-color: rgb(100, 100, 100);

    // .material-design-icon__svg {
    //   height: 18px;
    //   color: $white;
    // }
  }
}

.formatted-text-area {
  @include input();

  padding: $padding;

  font-size: 1.3em;
  min-height: 3rem;

  span {
    display: block;
  }

  padding-right: 50px;
}
</style>
