export default class Person {
    static getName(person) {
        return person.shortName || person.name || `Unbenannte Person Nr. ${person.id}`
    }

    static getOtherPersonsByRoleName(type, roleName) {

        const otherPersons = type?.otherPersons

        return (otherPersons) ? otherPersons.filter((person) => {
            return person?.role?.name === roleName;
        }) : []
    }
}