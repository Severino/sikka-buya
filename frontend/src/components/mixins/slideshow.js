export default {
    mounted: async function () {
        this.$root.$on('request-slide', this.requestSlide);
        this.$root.$on('apply-slide', this.applySlide);
    },
    unmounted: function () {
        this.$root.$off('request-slide', this.requestSlide);
        this.$root.$off('apply-slide', this.applySlide);
    },
    methods: {
        requestSlide() {
            throw new Error("RequiredMethod not implemented: requestSlide({slideshow, index}).")
        }, applySlide() {
            throw new Error("RequiredMethod not implemented: requestSlide(options).")
        },
    }
} 