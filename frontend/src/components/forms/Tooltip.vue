<template>
    <span class="tooltip" ref="tooltip">
        <slot />
    </span>
</template>

<script>
let interval
export default {
    mounted() {
        const tooltip = this.$refs.tooltip
        const rect = tooltip.getBoundingClientRect()
        const scrollbarWidth = 30
        if (rect.right > window.innerWidth - scrollbarWidth) {

            let toLeft = Math.ceil(window.innerWidth - scrollbarWidth - rect.right)
            tooltip.style.left = toLeft + "px"

            console.log("correct", tooltip.style.left, toLeft)
        }
    }
};
</script>

<style lang='scss' scoped>
.tooltip {
    position: absolute;
    white-space: nowrap;
    transform: translateY(calc(-100% - 3px));
    top: 0;
    left: 0;
    pointer-events: none;
    background-color: white;
    border: $border;
    border-radius: 4px;
    font-weight: normal;
    color: $gray;
    padding: math.div($padding, 2) $padding;
    z-index: 10000;
    font-size: $small-font;
}
</style>