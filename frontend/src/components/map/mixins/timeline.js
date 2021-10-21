import Query from '../../../database/query';

export default {
    data: function () {
        return {
            timeline: { from: null, to: null, value: null },
        }
    },
    methods: {
        timeChanged: async function (val) {
            this.timeline.value = val;
            this.selectedMints = [];
            this.update();
        },
        initTimeline: async function () {
            try {
                let result = await Query.raw(
                    `{
                    timespan {
                      from
                      to
                    }
            }`);

                let timeline = result.data.data.timespan;
                timeline.value = 364;
                this.timeline = timeline;
                window.map = this.map;
            } catch (e) {
                console.error(e);
            }
        },
    }
}