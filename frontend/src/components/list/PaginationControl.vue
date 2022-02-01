<template>
  <div class="pagination-control">
    <div class="left">
      <input
        type="number"
        :value="value.count"
        @change="countChanged"
        min="1"
      />
      <span>Elemente pro Seite</span>
    </div>
    <div class="center">
      <span>
        {{ this.fromItem }}
        ...
        {{ this.toItem }}
        ({{ this.value.total }})
      </span>
    </div>
    <div class="right">
      <button type="button" @click="changePage(0)">1</button>
      <button type="button" @click="toLastPage"><ChevronLeft /></button>
      <input type="number" :value="value.page + 1" @change="setPageEvt" />
      <button type="button" @click="toNextPage"><ChevronRight /></button>
      <button type="button" @click="changePage(value.last)">
        {{ value.last + 1 }}
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
    value: {
      type: Object,
      required: true,
      validator: function (value) {
        return (
          Object.prototype.hasOwnProperty.call(value, 'page') &&
          Object.prototype.hasOwnProperty.call(value, 'last') &&
          Object.prototype.hasOwnProperty.call(value, 'total') &&
          Object.prototype.hasOwnProperty.call(value, 'count')
        );
      },
    },
  },
  watch: {
    value: {
      handler(val) {
        this.changed(val);
      },
      deep: true,
    },
  },
  methods: {
    changed(pageInfo) {
      pageInfo.page = Math.max(Math.min(pageInfo.page, pageInfo.total), 0);
      pageInfo.last = Math.floor(pageInfo.total / pageInfo.count);
      pageInfo.page =
        pageInfo.page > pageInfo.last ? pageInfo.last : pageInfo.page;

      this.$emit('input', pageInfo);
    },
    countChanged(event) {
      let pageInfo = this.value;
      pageInfo.count = parseInt(event.target.value);
      this.changed(pageInfo);
    },
    toLastPage() {
      this.changePage(Math.max(this.value.page - 1, 0));
    },
    toNextPage() {
      this.changePage(Math.min(this.value.page + 1, this.value.last));
    },
    setPageEvt(evt) {
      const value = parseInt(evt.target.value);
      if (value != null) {
        this.changePage(value - 1);
      }
    },
    changePage(next = null) {
      let pageInfo = this.value;
      if (pageInfo.page != next) {
        pageInfo.page = next;
        this.changed(pageInfo);
      }
    },
  },
  computed: {
    fromItem() {
      return Math.min(this.value.total, this.value.page * this.value.count + 1);
    },
    toItem() {
      let page = (this.value.page + 1) * this.value.count;
      return Math.min(this.value.total, page);
    },
  },
};
</script>

<style scoped>
.pagination-control {
  display: flex;
  justify-content: space-between;
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

.center {
  align-items: center;
}

input[type='number'] {
  width: 65px;
}

.left span {
  margin-left: 1em;
  display: block;
  align-self: center;
}
</style>
