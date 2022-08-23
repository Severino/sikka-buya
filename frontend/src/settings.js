const DefaultSettings = {
    Map: {
        location: [30.521645759075508, 48.890055500146026],
        zoom: 6
    },
    Timeline: {
        active: true,
        value: 333
    },
    MintLocationMarker: {
        radius: 6,
        stroke: true,
        weight: 1,
        color: "#333",
        fillColor: 'white',
        fillOpacity: 1,
    },
    MintLocationMarkerUncertainIcon: {
        stroke: false,
        color: "#666666",
        fillOpacity: 1
    },
    Overlay: {
        uiOpen: false,
    },
    PoliticalOverlay: {
        _requires: ["Timeline", "Overlay"],
        innerRadius: 6,
        maxRadius: 30,
        maxRadiusMinimum: 10,
        maxRadiusMaximum: 100
    },
    MaterialOverlay: {
        _requires: ["Timeline", "Overlay"],
        innerRadius: 6,
        maxRadius: 14,
        maxRadiusMinimum: 10,
        maxRadiusMaximum: 50
    }
}



export default class Settings {
    static get defaultSettings() {
        return DefaultSettings
    }

    static _getDefault(key) {
        if (!DefaultSettings[key]) throw new Error(`Key does not exist: ${key}.`)
        return DefaultSettings[key]
    }

    static getDefault(key = null) {
        let settings = Settings._getDefault(key)
        const requires = settings._requires || []
        for (let req = 0; req < requires.length; req++) {

            let required = this.getDefault(requires[req])
            settings = Object.assign({}, required, settings)

        }
        delete settings._requires
        return settings
    }

    static getStoragePath(key) {
        return "sikka-buya-settings-" + key.toLowerCase()
    }

    constructor(window, key) {
        this.key = key
        this.window = window
        this.settings = Settings.getDefault(key)
    }

    onSettingsChanged(fun) {
        this._onSettingsChanged = fun
    }

    /**
     * Call it once on startup. 
     * Setups all localStorage items, so that all 
     * are set on first startup.
     */
    static init(window) {
        Object.entries(this.defaultSettings).forEach(([name, settings]) => {
            const atStoragePath = Settings.getStoragePath(name)
            if (!window.localStorage.getItem(atStoragePath)) {
                this._save(window, name, settings)
            }
        })
    }

    save() {
        Settings._save(this.window, this.key, this.settings)
    }

    static _save(window, key, data) {
        const atStoragePath = Settings.getStoragePath(key)
        window.localStorage.setItem(atStoragePath, JSON.stringify(data))
    }

    load() {
        let settings = Object.assign({}, Settings.getDefault(this.key))
        const storagePath = Settings.getStoragePath(this.key)
        try {
            const dataString = this.window.localStorage.getItem(storagePath)
            const parsedSettings = JSON.parse(dataString)
            settings = Object.assign({}, settings, parsedSettings)
        } catch (e) {
            throw new Error(`Could not load and apply local storage data: ${this.key}.`)
        }

        this.settings = settings
        return settings
    }

    get(key) {
        return this.settings[key]
    }

    apply(vue) {
        const settings = this.load()
        Object.assign(this.settings, settings)
        for (let [name, value] of Object.entries(this.settings)) {
            vue.$set(vue.$data, name, value)
        }
    }

    toggle(key) {
        this._changed([[key, !this.settings[key]]])
    }

    multiChange(keyValPairs) {
        this._changed(keyValPairs)
    }

    change(key, value) {
        this._changed([[key, value]])
    }

    _changed(keyValPairs = []) {
        keyValPairs.forEach(([key, val]) => {
            this.settings[key] = val
        })
        this.save()
        if (this._onSettingsChanged)
            this._onSettingsChanged(keyValPairs)
    }

    reset() {
        let settings = Object.assign({}, Settings.getDefault(this.key))
        this._changed(Object.entries(settings))
    }
}