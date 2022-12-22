export default class List {
    static toggle(list, value) {
        let idx = list.indexOf(value)
        if (idx === -1)
            list.push(value)
        else
            list.splice(idx, 1)

        return list
    }
}