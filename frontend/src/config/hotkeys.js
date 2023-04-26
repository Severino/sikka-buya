import { method } from "cypress/types/bluebird";

export default {
    map: {
        slideshow: {
            previous: {
                keys: ['a', "PageUp"],
                method: "prevSlide"
            },
            next: {keys :
                ['d', "PageDown"],
                method: "nextSlide"
            },
            capture: {key: 'w', method:"requestSlide"},
            delete: {key: 'q', method:"removeSlide"},
            sync: {key: 'e', method:"overrideSlide"},
        }
    }
}