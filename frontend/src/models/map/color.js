export default class Color {

    static byIndex(i) {
        const colors = [
            '#7CCC7B',
            '#FFB581',
            '#89B0AE',
            '#A1DAA0',
            '#FEDFCA',
            '#f1e8b8',
            '#BEE3DB'
        ];
        if (i > colors.length) console.error('Ran out of colors!', i);
        return colors[i % colors.length];
    }

}