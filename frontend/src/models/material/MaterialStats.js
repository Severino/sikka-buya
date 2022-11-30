export default class MaterialStats {
    constructor() {
        this.total = 0
        this.materialSet = new Set()
        this.materialStats = {}
    }

    get() {
        return this.materialStats
    }

    add(material, num = 1) {
        if (material?.id) {
            this.total += num
            const id = material.id
            if (!this.materialSet.has(id)) {
                this.materialSet.add(id)
                this.materialStats[id] = new MaterialStatItem(material, num)
            } else {
                this.materialStats[id].add(num)
            }
        }
    }

    static fromTypes(types) {
        const materialStats = new MaterialStats()
        for (let type of types) {
            if (!(type?.mint?.id) && !(type.material)) {
                continue
            } else {
                materialStats.addMaterial(type.material)
            }
        }
        return materialStats
    }
}

class MaterialStatItem {
    constructor(material, num) {
        this.material = material
        this.num = num
    }

    add(num = 1) {
        this.num += num
    }
}