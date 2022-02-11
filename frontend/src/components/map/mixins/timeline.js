import Query from '../../../database/query';
import RequestBuffer from '../../../models/request-buffer';

export default {
    data: function () {
        return {
            raw_timeline: { from: 0, to: 100, value: 0 }, timeBuffer: null
        }
    },
    mounted() {
        this.timeBuffer = new RequestBuffer(100)
    },
    methods: {
        timeChanged: async function (val) {

            this.timeBuffer.update(val, () => {
                this.raw_timeline.value = val;
                this.selectedMints = [];
                /** 
                 * To allow proper editing, but also preventing the timeline
                 * to go above min and above max, we clamp the values for the 
                 * updateTimeline.
                 */
                this.updateTimeline();
            })

        },
        initTimeline: async function (value) {
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
        updateTimeline() {
            throw new Error("Mixin requires method 'updateTimeline'.")
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