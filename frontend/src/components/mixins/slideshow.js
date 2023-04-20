export default {
    mounted: async function () {
        this.$root.$on('request-slide-options', this.requestSlideOptions);
        this.$root.$on('slides-loaded', this.slideshowSlidesLoaded);
        this.$root.$on('apply-slide', this.applySlide);
    },
    beforeDestroy: function () {
        this.$root.$off('request-slide-options', this.requestSlideOptions);
        this.$root.$on('slides-loaded', this.slideshowSlidesLoaded);
        this.$root.$off('apply-slide', this.applySlide);
    },
    methods: {
        /**
         * The display is calculated from the slides content on
         * creation. When we load slides with 'old' display values
         * we need to update the display values.
         * 
         * @param {Array} slides - slides to update
         * @param {Object} slideshow - slideshow component
         * @returns {Array} slides with updated display values
         */
        slideshowSlidesLoaded({ slides, slideshow } = {}) {
            throw new Error("RequiredMethod not implemented: slideshowSlidesLoaded().")
        },
        requestSlideOptions() {
            throw new Error("RequiredMethod not implemented: requestSlideOptions({slideshow, index}).")
        }, 
        applySlide() {
            throw new Error("RequiredMethod not implemented: requestSlideOptions(options).")
        },
        saveSlides(){
            this.$root.emit('save-slides');
        }
    }
} 