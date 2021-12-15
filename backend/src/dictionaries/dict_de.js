const Dictionary = require('./dictionary')

const dict = new Dictionary("de", {
    front_side_field_text: "Av. Feld",
    front_side_inner_inscript: "Av. innere Umschrift",
    front_side_intermediate_inscript: "Av. mittlere Umschrift",
    front_side_outer_inscript: "Av. äußere Umschrift",
    front_side_misc: "Av. Randbeschriftung",
    back_side_field_text: "Rev. Feld",
    back_side_inner_inscript: "Rev. innere Umschrift",
    back_side_intermediate_inscript: "Rev. mittlere Umschrift",
    back_side_outer_inscript: "Rev. äußere Umschrift",
    back_side_misc: "Rev. Randbeschriftung",
    literature: "Literatur & Anmerkungen",
    specials: "Besonderheiten/Varianten",
})

module.exports = dict