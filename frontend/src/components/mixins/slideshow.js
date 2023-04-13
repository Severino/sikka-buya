export default {
    mounted: async function () {
        this.$root.$on('request-slide-options', this.requestSlideOptions);
        this.$root.$on('apply-slide', this.applySlide);
    },
    beforeDestroy: function () {
        this.$root.$off('request-slide-options', this.requestSlideOptions);
        this.$root.$off('apply-slide', this.applySlide);
    },
    methods: {
        requestSlideOptions() {
            throw new Error("RequiredMethod not implemented: requestSlideOptions({slideshow, index}).")
        }, applySlide() {
            throw new Error("RequiredMethod not implemented: requestSlideOptions(options).")
        },
    }
} 