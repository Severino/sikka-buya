import { MissingOverloadException } from '../../../shared/errors';
import MapView from './MapView';


export class MapView {

    update() {
        MissingOverloadException(this.constructor.name, "update")
    }

    draw() {
        MissingOverloadException(this.constructor.name, "draw")
    }
}


