export default class Person {
    static getName(ruler) {
        return ruler.shortName || ruler.name || "Anonyme Person"
    }
}