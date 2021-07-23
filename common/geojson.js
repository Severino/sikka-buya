export default class GeoJSON{
    static flatMapToPolygon(obj){
        if (obj.type == "polygon") {
            let coords = []
            for (let i = 0; i < obj.coordinates.length - 1; i += 2) {
                coords.push([obj.coordinates[i], obj.coordinates[i + 1]])
            }
            obj.coordinates = [coords]
        }
    }
}
