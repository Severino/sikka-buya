import Query from '../../../database/query';
import RequestBuffer from '../../../models/request-buffer';
import URLParams from '../../../utils/URLParams';

export default {
    data: function () {
        return {
            timelineActive: false,
            raw_timeline: { from: 0, to: 100, value: 0 }, timeBuffer: null
        }
    },
    mounted() {
        this.timeBuffer = new RequestBuffer(100)
    },
    methods: {
        toggleTimeline() {
            this.timelineActive = !this.timelineActive
        },
        timeChanged: async function (val) {
            this.timeBuffer.update(val, () => {
                this.raw_timeline.value = val;
                /** 
                 * To allow proper editing, but also preventing the timeline
                 * to go above min and above max, we clamp the values for the 
                 * timelineUpdated.
                 */
                this.timelineUpdated();

                URLParams.update({ year: val })
                try {
                    localStorage.setItem('map-timeline', val);
                } catch (e) {
                    console.warn(e);
                }
            })

        },
        initTimeline: async function (value) {

            let storageValue = value
            try {
                let parsed = parseInt(localStorage.getItem('map-timeline'))
                if (!isNaN(parsed)) storageValue = parsed
            } catch (e) {
                console.warn(e)
            }

            value = this.$route.query.year && !isNaN(parseInt(this.$route.query.year))
                ? parseInt(this.$route.query.year)
                : storageValue;

            try {
                let result = await Query.raw(
                    `{
                    timespan {
                      from
                      to
                    }
            }`);

                let timeline = result.data.data.timespan;
                timeline.value = value;
                this.raw_timeline = timeline;
                window.map = this.map;
            } catch (e) {
                console.error(e);
            }
        },
        timelineUpdated() {
            throw new Error("Mixin requires method 'timelineUpdated'.")
        }
    },
    computed: {
        timeline() {
            return Object.assign({}, this.raw_timeline, {
                value: Math.min(Math.max(this.raw_timeline.value, this.raw_timeline.from), this.raw_timeline.to)
            })
        },
        timelineValid() {
            return this.timeline.value === this.raw_timeline.value
        }
    }
}