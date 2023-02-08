import Time from '../../utils/Time'

export default {
    methods: {
        timeMixinFormatDate(timestamp) {
            return Time.formatDate(timestamp)
        }
    }
}