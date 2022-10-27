import { expect } from 'chai';
import Range from './range.js';

describe("Test overlapping Ranges", () => {

    it("[[[1,2]],[[3,4]],[[7,8],[18,22]]]", function () {
        expect(Range.union([[[1, 2]], [[3, 4]], [[7, 8], [18, 22]]])).to.deep.equal([[1, 2], [3, 4], [7, 8], [18, 22]])
    })

    it("[[1,2],[2,3],[3,4]] should be [[1,4]]", function () {
        expect(
            Range.union([
                [[1, 2]],
                [[2, 3]],
                [[3, 4]]
            ])
        ).to.deep.equal([[1, 4]]);
    });

    it("[[[1, 2]],[[-100, 100]],[[3, 4]],[[2, 9]]] should be [[-100,100]]", function () {
        expect(
            Range.union([
                [[1, 2]],
                [[-100, 100]],
                [[3, 4]],
                [[2, 9]]
            ])
        ).to.deep.equal([[-100, 100]]);
    });



    it("[[[4, 8], [6, 10], [1, 2]],[[46, 80], [-10, -3]],[[1, 2], [-12, -8]]] should be [[-12, -3], [1, 2], [4, 10], [46, 80]]", function () {
        expect(
            Range.union([
                [[4, 8], [6, 10], [1, 2]],
                [[46, 80], [-10, -3]],
                [[1, 2], [-12, -8]]
            ])
        ).to.deep.equal([[-12, -3], [1, 2], [4, 10], [46, 80]]);
    });


})