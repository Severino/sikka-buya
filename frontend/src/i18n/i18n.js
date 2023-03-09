import Vue from "vue"
import VueI18n from "vue-i18n";

export async function load() {
    let messages = { de: {}, en: {} }
    try {
        let { default: cmsMessages } = await import("../../public/lang")
        messages = cmsMessages
    } catch (e) {
        console.warn("Could not load messages from public path.", e);
    }

    console.log(messages)

    Vue.use(VueI18n)

    return new VueI18n({
        locale: "en",
        messages
    })
}