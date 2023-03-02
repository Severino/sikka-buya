<template>
    <span class="tooltip">
        <slot />
    </span>
</template>

<script>
let interval
export default {
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
    border-radius: 2px;
    padding: math.div($padding, 2) $padding;
}
</style>