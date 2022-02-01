export default class Person {
    static getName(person) {
        return person.shortName || person.name || `Unbenannte Person Nr. ${person.id}`
    }
}