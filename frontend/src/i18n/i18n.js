import Vue from "vue"
import VueI18n from "vue-i18n";
import Query from "../database/query"


export default class I18n {

    static async reload(vue) {
        if (!vue.$i18n) throw new Error("No localization was found")
        else {
            const messages = await this.loadMessages()
            const locale = vue.$i18n.locale
            if (messages[locale]) {

                vue.$i18n.setLocaleMessage(locale, messages[locale])



            }
        }
    }

    static async loadMessages() {
        let messages = {}

        const result = await Query.raw(`{i18n}`)
        let data = result.data.data.i18n

        try {
            messages = JSON.parse(data)
        } catch (e) {
            console.error(e)
        }
        return messages
    }


    static async load() {
        const messages = await this.loadMessages()
        Vue.use(VueI18n)
        return new VueI18n({
            locale: "en",
            messages
        })
    }

}