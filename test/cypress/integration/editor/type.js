export default function () {

    // it("Item in editor list", function () {
    //     cy.visit('/editor')
    //     cy.get("a").contains("Typ")
    // })

    // it("Navigate to List", function () {
    //     cy.get("a").contains("Typ").click()
    //     cy.location("pathname").should((pathname) => {
    //         expect(pathname).to.eq("/editor/type")
    //     })

    //     cy.get(".list-item").contains('Šīr389')
    // })

    // it("Type list is showing", function () {
    //     cy.visit('/editor/type')
    //     cy.get(".list").children().should("have.length", 1)
    // })

    // it("List item is visible", function () {
    //     cy.visit('/editor/type')
    //     cy.get(".list-item").contains('Šīr389').should("be.visible")
    // })


    // describe("Done Button", function () {

    //     it("Can click button", function () {
    //         cy.visit('/editor/type')
    //         const completeButton = cy.get("#list-item-type-4 .done-button")
    //         completeButton.click()
    //         completeButton.find(".active").should("exist")
    //     })

    //     it("Other not active", function () {
    //         const completeButton = cy.get("#list-item-type-4 .reviewed-button")
    //         completeButton.find(".active").should("not.exist")
    //     })

    //     it("Still active on reload", function () {
    //         cy.visit('/editor/type')
    //         const completeButton = cy.get("#list-item-type-4 .done-button")
    //         completeButton.find(".active").should("exist")
    //     })

    //     it("Can disable button", function () {
    //         cy.visit('/editor/type')
    //         const completeButton = cy.get("#list-item-type-4 .done-button")
    //         completeButton.click()
    //         completeButton.find(".active").should("not.exist")
    //     })

    //     it("Still inactive on reload", function () {
    //         cy.visit('/editor/type')
    //         const completeButton = cy.get("#list-item-type-4 .done-button")
    //         completeButton.find(".active").should("not.exist")
    //     })

    // })

    // describe("Reviewed Button", function () {

    //     it("Can click button", function () {
    //         cy.visit('/editor/type')
    //         const completeButton = cy.get("#list-item-type-4 .reviewed-button")
    //         completeButton.click()
    //         completeButton.find(".active").should("exist")
    //     })

    //     it("Other not active", function () {
    //         const completeButton = cy.get("#list-item-type-4 .done-button")
    //         completeButton.find(".active").should("not.exist")
    //     })

    //     it("Still active on reload", function () {
    //         cy.visit('/editor/type')
    //         const completeButton = cy.get("#list-item-type-4 .reviewed-button")
    //         completeButton.find(".active").should("exist")
    //     })

    //     it("Can disable  button", function () {
    //         cy.visit('/editor/type')
    //         const completeButton = cy.get("#list-item-type-4 .reviewed-button")
    //         completeButton.click()
    //         completeButton.find(".active").should("not.exist")
    //     })

    //     it("Still inactive on reload", function () {
    //         cy.visit('/editor/type')
    //         const completeButton = cy.get("#list-item-type-4 .reviewed-button")
    //         completeButton.find(".active").should("not.exist")
    //     })

    // })




    describe("Create Type", function () {

        it("Can reach create page", function () {
            cy.visit("/editor/type")
            cy.get("#create-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/type/create")
            })

            cy.get("#type-id").should("have.value", "")
            cy.get("#type-treadwell-id").should("have.value", "")

            cy.checkDataSelect("#type-mint-field")
            cy.checkDataSelect("#type-mint-field")
            cy.get("#type-as-on-coin-field").should("have.value", "")
            cy.get("#checkbox-type-mint-uncertain").should("not.be.checked")

            cy.checkDataSelect("#type-material-data-field", "Silber", 6)
            cy.checkDataSelect("#type-nominal-data-field", "Dirham", 11)
            cy.get("#type-year-of-type-field").should("have.value", "")
            cy.get("#type-year-uncertain input[type=checkbox]").should("not.be.checked")
            cy.get("#type-donativ input[type=checkbox]").should("not.be.checked")
            cy.get("#type-procedure ").contains("geprägt").parent(".radio-button").find("input[type=radio]").should("be.checked")

        })


        //     it("Can cancel create", function () {
        //         cy.visit("/editor/type/create")

        //         cy.get("#person-name").type("xxxxx")
        //         cy.get("#person-short-name").type("xxxxx")

        //         cy.selectFromDataSelect("#person-role", "heir")

        //         cy.selectFromDataSelect("#person-dynasty", 'Būyide')
        //         cy.get("#person-color input[type=text]").clear().type("ffff00")

        //         cy.get("#cancel-button").click()
        //         cy.location("pathname").should((pathname) => {
        //             expect(pathname).to.eq("/editor/type")
        //         })
        //         cy.get(".list-item").contains('Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya').find(".color-indicator").should("have.css", "background-color", "rgb(255, 0, 255)")
        //         cy.get(".list-item").contains('Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz').find(".color-indicator").should("have.css", "background-color", "rgb(0, 255, 255)")
        //         cy.get(".list-item").contains('al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir').find(".color-indicator").should("have.css", "background-color", "rgb(255, 255, 0)")

        //         cy.get(".list-item").children().should("have.length", 3)
        //     })

        //     it("Can create new person", function () {
        //         cy.visit("/editor/type/create")

        //         cy.get("#person-name").type("al-Mustakfī bi-᾽llāh, Abu ᾽l-Qāsim ʿAbdallāh b. al-Muktafī")
        //         cy.get("#person-short-name").type("al-Mustakfī")

        //         cy.selectFromDataSelect("#person-role", "caliph")

        //         cy.selectFromDataSelect("#person-dynasty", 'ʿAbbāside')
        //         cy.get("#person-color input[type=text]").clear().type("13ce56")

        //         cy.get("#submit-button").click()
        //         cy.location("pathname").should((pathname) => {
        //             expect(pathname).to.eq("/editor/type")
        //         })
        //         cy.get(".list-item").contains('Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya').find(".color-indicator").should("have.css", "background-color", "rgb(255, 0, 255)")
        //         cy.get(".list-item").contains('Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz').find(".color-indicator").should("have.css", "background-color", "rgb(0, 255, 255)")
        //         cy.get(".list-item").contains('al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir').find(".color-indicator").should("have.css", "background-color", "rgb(255, 255, 0)")
        //         cy.get(".list-item").contains("al-Mustakfī bi-᾽llāh, Abu ᾽l-Qāsim ʿAbdallāh b. al-Muktafī").find(".color-indicator").should("have.css", "background-color", "rgb(19, 206, 86)")

        //         cy.get(".list-item").children().should("have.length", 4)
        //     })

        //     it("Created person should be correct", function () {
        //         cy.visit("/editor/type/4")

        //         cy.get("#person-id").should("have.value", 4)
        //         cy.get("#person-name").should("have.value", "al-Mustakfī bi-᾽llāh, Abu ᾽l-Qāsim ʿAbdallāh b. al-Muktafī")
        //         cy.get("#person-short-name").should("have.value", "al-Mustakfī")
        //         cy.get("#person-role .name-field").should("have.value", "caliph")
        //         cy.get("#person-role .data-select-id").should("have.value", 5)
        //         cy.get("#person-dynasty .name-field").should("have.value", "ʿAbbāside")
        //         cy.get("#person-dynasty .data-select-id").should("have.value", 2)
        //         cy.get("#person-color input[type=text]").should("have.value", "13ce56")
        //     })

        // it("Can filter", function () {
        //     cy.visit('/editor/type')
        //     cy.get("input[type=search]").type("si")
        //     cy.get(".list-item").contains('Šīr389')
        //     cy.get(".list").children().should("have.length", 1)
        // })

        // })

        // describe("Edit Type", function () {

        //     it("Access edit page", function () {
        //         cy.visit('/editor/type')
        //         cy.get(".list-item").contains("al-Mustakfī bi-᾽llāh, Abu ᾽l-Qāsim ʿAbdallāh b. al-Muktafī").click()
        //         cy.location("pathname").should((pathname) => {
        //             expect(pathname).to.eq("/editor/type/4")
        //         })
        //     })

        //     it("Cannot edit with wrong id", function () {
        //         cy.visit('/editor/type/8')
        //         cy.get(".information.error").should("not.be.empty")
        //         cy.get("button").contains("senden").should("have.attr", "disabled")
        //     })


        //     it("Correct id set for update", function () {
        //         cy.visit('/editor/type/4')
        //         cy.get("#person-id").should("have.value", 4)
        //     })


        //     it("Can cancel update", function () {
        //         cy.visit('/editor/type/4')

        //         cy.get("#person-name").type("Abu ’l-Wafāʾ Tuzun")
        //         cy.get("#person-short-name").type("Tuzun")

        //         cy.selectFromDataSelect("#person-role", "cutter")

        //         cy.selectFromDataSelect("#person-dynasty", 'Būyide')
        //         cy.get("#person-color input[type=text]").clear().type("ff0000")

        //         cy.get("#cancel-button").click()
        //         cy.get(".list-item").contains('Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya').find(".color-indicator").should("have.css", "background-color", "rgb(255, 0, 255)")
        //         cy.get(".list-item").contains('Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz').find(".color-indicator").should("have.css", "background-color", "rgb(0, 255, 255)")
        //         cy.get(".list-item").contains('al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir').find(".color-indicator").should("have.css", "background-color", "rgb(255, 255, 0)")
        //         cy.get(".list-item").contains("al-Mustakfī bi-᾽llāh, Abu ᾽l-Qāsim ʿAbdallāh b. al-Muktafī").find(".color-indicator").should("have.css", "background-color", "rgb(19, 206, 86)")

        //         cy.get(".list-item").children().should("have.length", 4)
        //     })



        //     it("Can update", function () {
        //         cy.visit('/editor/type/4')

        //         cy.get("#person-name").clear().type("Abu ’l-Wafāʾ Tuzun")
        //         cy.get("#person-short-name").clear().type("Tuzun")

        //         cy.selectFromDataSelect("#person-role", "cutter")

        //         cy.selectFromDataSelect("#person-dynasty", 'Būyide')
        //         cy.get("#person-color input[type=text]").clear().type("ff0000")

        //         cy.get("#submit-button").click()
        //         cy.get(".list-item").contains('Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya').find(".color-indicator").should("have.css", "background-color", "rgb(255, 0, 255)")
        //         cy.get(".list-item").contains('Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz').find(".color-indicator").should("have.css", "background-color", "rgb(0, 255, 255)")
        //         cy.get(".list-item").contains('al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir').find(".color-indicator").should("have.css", "background-color", "rgb(255, 255, 0)")
        //         cy.get(".list-item").contains("Abu ’l-Wafāʾ Tuzun").find(".color-indicator").should("have.css", "background-color", "rgb(255, 0, 0)")

        //         cy.get(".list-item").children().should("have.length", 4)
        //     })

        //     it("Updated person should be correct", function () {
        //         cy.visit("/editor/type/4")

        //         cy.get("#person-id").should("have.value", 4)
        //         cy.get("#person-name").should("have.value", "Abu ’l-Wafāʾ Tuzun")
        //         cy.get("#person-short-name").should("have.value", "Tuzun")
        //         cy.get("#person-role .name-field").should("have.value", "cutter")
        //         cy.get("#person-role .data-select-id").should("have.value", 4)
        //         cy.get("#person-dynasty .name-field").should("have.value", "Būyide")
        //         cy.get("#person-dynasty .data-select-id").should("have.value", 1)
        //         cy.get("#person-color input[type=text]").should("have.value", "ff0000")
        //     })

        // })


        // describe("List Order", function () {
        //     it("List is in alphabetical order", function () {
        //         cy.visit("/editor/type")
        //         cy.get('.list-item .cell')
        //             .then($items => {
        //                 const arr = $items.map((_, html) => Cypress.$(html).text()).get()
        //                 console.log(arr)
        //                 return arr
        //             })
        //             .should('deep.eq', ["Abu ’l-Wafāʾ Tuzun", 'al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir', 'Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya', 'Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz'])
        //     })
        // })

        // describe("Delete Type", function () {

        //     it("Delete", function () {
        //         cy.visit("/editor/type")
        //         cy.triggerDeleteButton(".list-item:nth-child(1) .dynamic-delete-button")

        //         cy.get(".list-item").contains('Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya').find(".color-indicator").should("have.css", "background-color", "rgb(255, 0, 255)")
        //         cy.get(".list-item").contains('Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz').find(".color-indicator").should("have.css", "background-color", "rgb(0, 255, 255)")
        //         cy.get(".list-item").contains('al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir').find(".color-indicator").should("have.css", "background-color", "rgb(255, 255, 0)")
        //         cy.get(".list-item").contains("Abu ’l-Wafāʾ Tuzun").should("not.exist")
        //     })

        //     it("Still Deleted On Reload", function () {
        //         cy.visit("/editor/type")
        //         cy.get(".list-item").contains('Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya').find(".color-indicator").should("have.css", "background-color", "rgb(255, 0, 255)")
        //         cy.get(".list-item").contains('Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz').find(".color-indicator").should("have.css", "background-color", "rgb(0, 255, 255)")
        //         cy.get(".list-item").contains('al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir').find(".color-indicator").should("have.css", "background-color", "rgb(255, 255, 0)")
        //         cy.get(".list-item").contains("Abu ’l-Wafāʾ Tuzun").should("not.exist")
        //     })
    })
}
