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

        this.load()

        this.timeBuffer = new RequestBuffer(100)
    },
    methods: {
        toggleTimeline() {
            this.timelineActive = !this.timelineActive
            this.save()
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
                this.save()
            })

        },
        load(options = {
            year: 433,
            timelineActive: true
        }) {

            const optionsString = localStorage.getItem('map-timeline')

            try {
                let loadedOptions = JSON.parse(optionsString)
                Object.assign(options, loadedOptions)
            } catch (e) {
                console.warn(e)
            }

            this.raw_timeline.value = URLParams.getInteger('year', options.year)
            this.timelineActive = URLParams.getBoolean('timelineActive', options.timelineActive)

        },
        save() {
            const option = { year: this.raw_timeline.value, timelineActive: this.timelineActive }
            URLParams.update(option)
            localStorage.setItem('map-timeline', JSON.stringify(option));
        },
        initTimeline: async function (value) {

            this.load()

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