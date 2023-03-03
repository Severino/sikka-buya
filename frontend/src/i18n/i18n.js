import Vue from "vue"
import VueI18n from "vue-i18n";

export async function load() {
    const { default: messages } = await import("../../public/lang")

    Vue.use(VueI18n)

    return new VueI18n({
        locale: "en",
        messages
    })
}