export default class Time {
    static formatDate(timestamp) {
        if (!timestamp) return '-';
        let date = new Date(parseInt(timestamp));
        return date.toLocaleString();
    }
}