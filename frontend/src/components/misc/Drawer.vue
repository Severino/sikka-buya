<template>
    <div class="drawer">
        <slot v-if="active"></slot>
    </div>
</template>

<script>
export default {
    props: {
        active: { type: Boolean, required: true },
        transitionTime: {
            type: Number,
            default: 300,
        },

    },
};
</script>

<style lang='scss' scoped></style>