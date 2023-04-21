<template>
    <div
        class="drawer"
        :class="{ closed: !active }"
    >
        <div
            class="drawer-content"
            v-show="active"
        >
            <slot>
                <!-- Drawer content -->
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        this.$nextTick(() => {
            this.$el.style.transition = `height ${this.transitionTime}ms`;
        });
    },
    props: {
        active: { type: Boolean, required: true },
        height: { type: Number, default: 100 },
        transitionTime: {
            type: Number,
            default: 300,
        },

    },
};
</script>
