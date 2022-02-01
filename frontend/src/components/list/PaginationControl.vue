<template>
  <div class="pagination-control">
    <div class="left">
      <input type="number" :value="count" @change="countChanged" min="1" />
      <span>Elemente pro Seite</span>
    </div>
    <div class="center">
      <span>
        {{ this.fromItem }}
        ...
        {{ this.toItem }}
        ({{ this.total }})
      </span>
    </div>
    <div class="right">
      <button type="button" @click="changePage(0)">1</button>
      <button type="button" @click="toLastPage"><ChevronLeft /></button>
      <input
        class="page-input"
        type="text"
        :value="pageValue"
        @input="setPageEvt"
      />
      <button type="button" @click="toNextPage"><ChevronRight /></button>
      <button type="button" @click="changePage(last)">
        {{ last + 1 }}
      </button>
    </div>
  </div>
</template>

<script>
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue';

export default {
  components: {
    ChevronRight,
    ChevronLeft,
  },
  props: {
    page: {
      type: Number,
      required: true,
    },
    last: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  methods: {
    changed(obj) {
      const pageInfo = Object.assign(
        {},
        {
          page: this.page,
          last: this.last,
          total: this.total,
          count: this.count,
        },
        obj
      );

      pageInfo.page = Math.max(Math.min(pageInfo.page, pageInfo.last), 0);
      pageInfo.last = Math.floor(pageInfo.total / pageInfo.count);

      this.$emit('input', pageInfo);
    },
    countChanged(event) {
      this.changed({ count: parseInt(event.target.value) });
    },
    toLastPage() {
      this.changePage(Math.max(this.page - 1, 0));
    },
    toNextPage() {
      this.changePage(Math.min(this.page + 1, this.last));
    },
    setPageEvt(evt) {
      const value = parseInt(evt.target.value);
      if (!isNaN(value)) {
        this.changePage(value - 1);
      } else {
        this.changePage(0);
      }
    },
    changePage(next = null) {
      if (this.page != next) {
        this.changed({ page: next });
      }
    },
  },
  computed: {
    fromItem() {
      return Math.min(this.total, this.page * this.count + 1);
    },
    toItem() {
      let page = (this.page + 1) * this.count;
      return Math.min(this.total, page);
    },
    pageValue() {
      return this.page + 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-control,
input,
button {
  font-size: $small-font;
}

.pagination-control {
  display: flex;
  justify-content: space-between;
  color: $white;
}

.pagination-control input,
.pagination-control button {
  padding: 3px 5px;
  min-width: 32px;
}
.left,
.right,
.center {
  display: flex;
}

.right {
  border-radius: 3px;
  overflow: hidden;
  box-shadow: $shadow;
}

.center {
  align-items: center;
}

.page-input {
  text-align: center;
  width: 36px;
}

input[type='number'] {
  width: 65px;
  text-align: center;
  border-radius: 3px;
}

.left span {
  margin-left: 1em;
  display: block;
  align-self: center;
}
</style>
