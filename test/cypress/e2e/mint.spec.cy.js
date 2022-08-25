describe("Testing Mints", function () {

    this.beforeAll(function () {
        cy.task("MountMinimalDatabase")
        cy.fixture("users/admin").then(user => {
            cy.login(user.email, user.password)
        })
    })

    this.beforeEach(function () {
        cy.restoreLocalStorage()
    })

    it("Item in editor list", function () {
        cy.visit('/editor')
        cy.get(".list-item").contains("Prägeort")
    })

    it("Navigate to List", function () {
        cy.get(".list-item").contains("Prägeort").click()
        cy.location("pathname").should((pathname) => {
            expect(pathname).to.eq("/editor/mint")
        })


    })

    it("Prägeort list is showing", function () {
        cy.visit('/editor/mint')
        cy.get(".list").children().should("have.length", 2)
        cy.get(".list-item").contains("Fārs")
        cy.get(".list-item").contains('Šīrāz')
    })

    it("List item is visible", function () {
        cy.visit('/editor/mint')
        cy.get(".list-item").contains("Fārs").should("be.visible")
    })

    it("Can filter", function () {
        cy.visit('/editor/mint')
        cy.get("input[type=search]").type("fa")
        cy.get(".list-item").contains("Fārs")
        cy.get(".list").children().should("have.length", 1)
    })

    describe("Create Prägeort", function () {

        it("Can reach create page", function () {
            cy.visit("/editor/mint")
            cy.get("#create-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/mint/create")
            })
        })

        it("Create page displayed correctly", function () {
            cy.visit("/editor/mint/create")

            cy.get("#mint-id").should("have.value", "-1")
            cy.get("#mint-name").should("have.value", "")

            cy.get("#mint-province .data-select-id").should("have.value", "")
            cy.get("#mint-province .name-field").should("have.value", "")

            cy.get("#mint-location .location-input-field").should("have.value", "")
            cy.get("#mint-location .leaflet-container").should("exist")

            cy.get("#mint-notes").should("have.value", "")

            cy.get("#mint-location-uncertain input").should("not.have.attr", "checked")
            cy.get("#mint-location-uncertain label").click()

            cy.get("#mint-uncertain-location-input .leaflet-container").should("exist")

        })

        it("Can cancel create", function () {
            cy.visit("/editor/mint/create")
            cy.get("#mint-name").type("xxxxx")
            cy.selectFromDataSelect("#mint-province", "Fārs")

            cy.get("#mint-location .leaflet-container").click("center", {
                ctrlKey: true
            })

            cy.get("#mint-location input").should("have.value", "[30.02, 50.93]")
            cy.get("#mint-location-uncertain label").click()
            cy.get("#mint-location input").should("have.value", "[30.02, 50.93]")

            cy.get("#mint-uncertain-location-input .leaflet-container").click(10, 10, {
                ctrlKey: true
            }).click(10, 100, {
                ctrlKey: true
            }).click(100, 100, {
                ctrlKey: true
            }).click(100, 10, {
                ctrlKey: true
            })
            cy.get("#mint-uncertain-location-input input").should("have.value", "[38.68, 31.16] [35.52, 31.16] [35.52, 35.11] [38.68, 35.11]")

            cy.get("#mint-notes").type("This will be cancelled soon!")

            cy.get("#cancel-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/mint")
            })

            cy.get(".list-item").contains("Fārs")
            cy.get(".list-item").contains('Šīrāz')
            cy.get(".list-item").children().should("have.length", 2)

        })


        it("Can create new mint", function () {
            cy.visit("/editor/mint/create")
            cy.get("#mint-name").type("Aiḏaǧ")
            cy.selectFromDataSelect("#mint-province", "Ḫūzistān")

            cy.get("#mint-location .leaflet-container").click("center", {
                ctrlKey: true
            })

            cy.get("#mint-location input").should("have.value", "[30.02, 50.93]")
            cy.get("#mint-location-uncertain label").click()
            cy.get("#mint-location input").should("have.value", "[30.02, 50.93]")

            cy.get("#mint-uncertain-location-input .leaflet-container").click(10, 10, {
                ctrlKey: true
            }).click(10, 100, {
                ctrlKey: true
            }).click(100, 100, {
                ctrlKey: true
            }).click(100, 10, {
                ctrlKey: true
            })
            cy.get("#mint-uncertain-location-input input").should("have.value", "[38.68, 31.16] [35.52, 31.16] [35.52, 35.11] [38.68, 35.11]")

            cy.get("#mint-notes").type("Newly created mint!")

            cy.get("#submit-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/mint")
            })

            cy.get(".list-item").contains("Fārs")
            cy.get(".list-item").contains('Šīrāz')
            cy.get(".list-item").contains("Aiḏaǧ")
            cy.get(".list-item").children().should("have.length", 3)
        })

        it("Created mint should be correct", function () {
            cy.visit("/editor/mint/3")

            cy.get("#mint-name").should("have.value", "Aiḏaǧ")

            cy.get("#mint-province .name-field").should("have.value", 'Ḫūzistān')
            cy.get("#mint-province .data-select-id").should("have.value", 10)

            cy.get("#mint-location-uncertain input").should("be.checked")
            cy.get("#mint-uncertain-location-input input").should("have.value", "[38.68, 31.16] [35.52, 31.16] [35.52, 35.11] [38.68, 35.11]")

            cy.get("#mint-notes").should("have.value", "Newly created mint!")
        })

    })

    describe("Edit Prägeort", function () {

        it("Access edit page", function () {
            cy.visit('/editor/mint')
            cy.get(".list-item").contains("Aiḏaǧ").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/mint/3")
            })
        })

        it("Cannot edit with wrong id", function () {
            cy.visit('/editor/mint/100')
            cy.get(".information.error").should("not.be.empty")
            cy.get("button").contains("senden").should("have.attr", "disabled")
        })


        it("Correct id set for update", function () {
            cy.visit('/editor/mint/3')
            cy.get("#mint-id").should("have.value", 3)
        })


        it("Can cancel update", function () {
            cy.visit("/editor/mint/3")
            cy.get("#mint-name").type("Huzū")
            cy.selectFromDataSelect("#mint-province", "Fārs")

            cy.get("#mint-location .leaflet-container").click(100, 100, {
                ctrlKey: true
            })
            cy.get("#mint-location input").should("have.value", "[35.52, 35.11]")


            cy.get("#mint-uncertain-location-input .delete-btn").click()
            cy.get("#mint-uncertain-location-input .leaflet-container").click(30, 30, {
                ctrlKey: true
            }).click(100, 50, {
                ctrlKey: true
            }).click(60, 150, {
                ctrlKey: true
            })

            cy.get("#mint-uncertain-location-input input").should("have.value", "[37.99, 32.04] [37.29, 35.11] [33.71, 33.35]")

            cy.get("#mint-notes").type("Oh we changed the notes completely!")

            cy.get("#cancel-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/mint")
            })

            cy.get(".list-item").contains("Fārs")
            cy.get(".list-item").contains('Šīrāz')
            cy.get(".list-item").contains("Aiḏaǧ")
            cy.get(".list-item").children().should("have.length", 3)
        })

        it("Cancelled update still correct", function () {
            cy.visit("/editor/mint/3")

            cy.get("#mint-name").should("have.value", "Aiḏaǧ")

            cy.get("#mint-province .name-field").should("have.value", 'Ḫūzistān')
            cy.get("#mint-province .data-select-id").should("have.value", 10)

            cy.get("#mint-location-uncertain input").should("be.checked")
            cy.get("#mint-uncertain-location-input input").should("have.value", "[38.68, 31.16] [35.52, 31.16] [35.52, 35.11] [38.68, 35.11]")

            cy.get("#mint-notes").should("have.value", "Newly created mint!")
        })



        it("Can update", function () {
            cy.visit("/editor/mint/3")
            cy.get("#mint-name").clear().type("Huzū")
            cy.selectFromDataSelect("#mint-province", "Fārs")

            cy.get("#mint-location .leaflet-container").click(100, 100, {
                ctrlKey: true
            })
            cy.get("#mint-location input").should("have.value", "[35.52, 35.11]")


            cy.get("#mint-uncertain-location-input .delete-btn").click()
            cy.get("#mint-uncertain-location-input .leaflet-container").click(30, 30, {
                ctrlKey: true
            }).click(100, 50, {
                ctrlKey: true
            }).click(60, 150, {
                ctrlKey: true
            })

            cy.get("#mint-uncertain-location-input input").should("have.value", "[37.99, 32.04] [37.29, 35.11] [33.71, 33.35]")

            cy.get("#mint-notes").clear().type("Oh we changed the notes completely!")

            cy.get("#submit-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/mint")
            })

            cy.get(".list-item").contains("Fārs")
            cy.get(".list-item").contains('Šīrāz')
            cy.get(".list-item").contains("Huzū")
            cy.get(".list-item").children().should("have.length", 3)
        })


        it("Updated person should be correct", function () {
            cy.visit("/editor/mint/3")

            cy.get("#mint-name").should("have.value", "Huzū")

            cy.get("#mint-province .name-field").should("have.value", 'Fārs')
            cy.get("#mint-province .data-select-id").should("have.value", 1)

            cy.get("#mint-location-uncertain input").should("be.checked")
            cy.get("#mint-uncertain-location-input input").should("have.value", "[37.99, 32.04] [37.29, 35.11] [33.71, 33.35]")

            cy.get("#mint-notes").should("have.value", "Oh we changed the notes completely!")

        })

    })


    describe("List Order", function () {
        it("List is in alphabetical order", function () {
            cy.visit("/editor/mint")
            cy.get('.list-item .cell')
                .then($items => {
                    const arr = $items.map((_, html) => Cypress.$(html).text()).get()
                    return arr
                })
                .should('deep.eq', ['Fārs', "Huzū", 'Šīrāz'])
        })
    })

    describe("Delete Prägeort", function () {

        it("Delete", function () {
            cy.visit("/editor/mint")
            cy.triggerDeleteButton(".list-item:nth-child(2) .dynamic-delete-button")

            cy.get(".list-item").contains('Fārs')
            cy.get(".list-item").contains('Šīrāz')
            cy.get(".list-item").contains("Huzū").should("not.exist")
        })

        it("Still Deleted On Reload", function () {
            cy.visit("/editor/mint")

            cy.get(".list-item").contains('Fārs')
            cy.get(".list-item").contains('Šīrāz')
            cy.get(".list-item").contains("Huzū").should("not.exist")
        })
    })
})
