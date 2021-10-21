export default class Color {

    static byIndex(i) {
        const colors = [
            '#7CFC00',
            '#1E90FF',
            '#DD0000',
            '#FFD700',
            '#DD00DD',
            '#CD853F',
            '#7FFFD4',
            "#9ACD32",
            "#00BFFF",
            "#FF6347",
            "#FFE4B5",
            '#8A2BE2',
            "#800000"


        ];
        if (i > colors.length) console.error('Ran out of colors!', i);
        return colors[i % colors.length];
    }

}