<template>
    <div class="hotkeyed">
        <slot></slot>
        <span class="combination-indicator" v-if="combination">({{ combination }})</span>
    </div>
</template>

<script>
export default {
    props: {
        combination: String,
    },
};
</script>

<style lang='scss' scoped>
.combination-indicator {
    color: $gray;
    font-size: 0.8em;
    margin-left: $small-padding;
}
</style>