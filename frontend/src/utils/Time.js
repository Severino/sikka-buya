export default class Time {
    static formatDateTime(timestamp) {
        if (!timestamp) return '-';
        let date = new Date(parseInt(timestamp));
        return date.toLocaleString("de-DE");
    }

    static formatDate(timestamp) {
        if (!timestamp) return '-';
        let date = new Date(parseInt(timestamp));
        return date.toLocaleDateString("de-DE");
    }
}