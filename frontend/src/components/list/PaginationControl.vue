<template>
  <div class="pagination-control">
    <div class="left">
      <input
        type="number"
        :value="value.count"
        @change="countChanged"
        min="1"
        :max="value.last + 1"
      />
      <span>Elemente pro Seite</span>
    </div>
    <div class="right">
      <button @click="changePage(0)">1</button>
      <button @click="lastPage"><ChevronLeft /></button>
      <input type="number" :value="value.page + 1" @change="setPageEvt" />
      <button @click="nextPage"><ChevronRight /></button>
      <button @click="changePage(value.last)">
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
  methods: {
    changed(pageInfo) {
      pageInfo.page = Math.max(Math.min(pageInfo.page, pageInfo.total), 0);
      pageInfo.last = Math.floor(pageInfo.total / pageInfo.count);
      pageInfo.page =
        pageInfo.page > pageInfo.last ? pageInfo.last : pageInfo.page;

      console.log(pageInfo.total, pageInfo.count, pageInfo.last);
      this.$emit('input', pageInfo);
    },
    countChanged(event) {
      let pageInfo = this.value;
      pageInfo.count = parseInt(event.target.value);
      this.changed(pageInfo);
    },
    lastPage() {
      this.changePage(Math.max(this.value.page - 1, 0));
    },
    nextPage() {
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
};
</script>

<style scoped>
.pagination-control {
  display: flex;
  justify-content: space-between;
}
.left,
.right {
  display: flex;
  /* align-items: center; */
}

input[type='number'] {
  width: 75px;
}

.left span {
  margin-left: 1em;
  display: block;
  align-self: center;
}
</style>
