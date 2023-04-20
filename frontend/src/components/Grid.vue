<template>
    <div
        class="grid"
        :style="style"
    >
        <div
            class="column"
            v-for="col of columns"
            :key="col"
        >
            <slot
                :name="col"
            ></slot>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        columns: {
            type: Number,
            required: true,
        }
    },
    computed: {
        style() {
            return {
                gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
            };
        }
    }
};
</script>

<style lang='scss' scoped>

.column {
    display: flex;
      align-items: center;
      gap: $small-padding;
      color: $white;
    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));


      &:last-child {
      margin-left: auto;
    }
}
</style>