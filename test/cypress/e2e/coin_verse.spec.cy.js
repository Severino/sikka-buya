describe("Testing Coin Verse", function () {

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
        cy.get(".list-item").contains("besondere Einzelworte, Formeln, Koranverse")
    })

    it("Navigate to List", function () {
        cy.visit('/editor')
        cy.get(".list-item").contains("besondere Einzelworte, Formeln, Koranverse").click()
        cy.location("pathname").should((pathname) => {
            expect(pathname).to.eq("/editor/coin_verse")
        })
    })

    it("List is showing", function () {
        cy.visit('/editor/coin_verse')
        cy.get(".list").children().should("have.length", 3)
    })

    it("List item is visible", function () {
        cy.visit('/editor/coin_verse')
        cy.get(".list-item").contains('Koran 9:33').should("be.visible")
        cy.get(".list-item").contains('محمد رسول الله').should("be.visible")
        cy.get(".list-item").contains('Koran 30:4‒5').should("be.visible")
    })

    it("Can filter", function () {
        cy.visit('/editor/coin_verse')
        cy.get("input[type=search]").type("ko")
        cy.get(".list").children().should("have.length", 2)
        cy.get(".list-item").contains('Koran 9:33').should("be.visible")
        cy.get(".list-item").contains('Koran 30:4‒5').should("be.visible")

    })

    describe("Create Coin verse", function () {

        it("Can reach create page", function () {
            cy.visit("/editor/coin_verse")
            cy.get("#create-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/coin_verse/create")
            })
            cy.get("#coin-verse-name").should("have.value", "")
        })


        it("Can cancel create", function () {
            cy.visit("/editor/coin_verse/create")
            cy.get("#coin-verse-name").type("xxxxx")
            cy.get("#cancel-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/coin_verse")
            })

            cy.get(".list-item").children().should("have.length", 3)
            cy.get(".list-item").contains('Koran 9:33').should("be.visible")
            cy.get(".list-item").contains('محمد رسول الله').should("be.visible")
            cy.get(".list-item").contains('Koran 30:4‒5').should("be.visible")
        })

        it("Can create new", function () {
            cy.visit("/editor/coin_verse/create")
            cy.get("#coin-verse-name").type("Koran 22:1-9")
            cy.get("#submit-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/coin_verse")
            })

            cy.get(".list-item").children().should("have.length", 4)
            cy.get(".list-item").contains('Koran 9:33').should("be.visible")
            cy.get(".list-item").contains('محمد رسول الله').should("be.visible")
            cy.get(".list-item").contains('Koran 30:4‒5').should("be.visible")
            cy.get(".list-item").contains('Koran 22:1-9').should("be.visible")

        })

    })

    describe("Edit Coin verse", function () {

        it("Access edit page", function () {
            cy.visit('/editor/coin_verse')
            cy.get(".list-item").contains("Koran 9:33").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/coin_verse/1")
            })
            cy.get("#coin-verse-name").should("have.value", "Koran 9:33")
        })

        it("Cannot edit with wrong id", function () {
            cy.visit('/editor/coin_verse/8')
            cy.get(".information.error").should("not.be.empty")
            cy.get("#submit-button").should("have.attr", "disabled")
        })


        it("Correct id set for update", function () {
            cy.visit('/editor/coin_verse/1')
            cy.get("#coin-verse-id").should("have.value", 1)
        })


        it("Can cancel update", function () {
            cy.visit('/editor/coin_verse/1')
            cy.get("#coin-verse-name").clear().type("xxxxxxxx")
            cy.get("#cancel-button").click()

            cy.get(".list-item").children().should("have.length", 4)
            cy.get(".list-item").contains('Koran 9:33').should("be.visible")
            cy.get(".list-item").contains('محمد رسول الله').should("be.visible")
            cy.get(".list-item").contains('Koran 30:4‒5').should("be.visible")
            cy.get(".list-item").contains('Koran 22:1-9').should("be.visible")
        })

        it("Can update", function () {
            cy.visit('/editor/coin_verse/1')
            cy.get("#coin-verse-name").clear().type("Koran 9:40")
            cy.get("#submit-button").click()

            cy.get(".list-item").children().should("have.length", 4)
            cy.get(".list-item").contains('Koran 9:40').should("be.visible")
            cy.get(".list-item").contains('محمد رسول الله').should("be.visible")
            cy.get(".list-item").contains('Koran 30:4‒5').should("be.visible")
            cy.get(".list-item").contains('Koran 22:1-9').should("be.visible")
        })

    })


    describe("List Order", function () {
        it("List is in alphabetical order", function () {
            cy.visit("/editor/coin_verse")
            cy.get('.list-item .list-item-cell')
                .then($items => {
                    const arr = $items.map((_, html) => Cypress.$(html).text()).get()
                    return arr
                })
                .should('deep.eq', ['Koran 22:1-9', 'Koran 30:4‒5', 'Koran 9:40', 'محمد رسول الله',])
        })
    })

    describe("Delete Coin verse", function () {

        it("Delete", function () {
            cy.visit("/editor/coin_verse")
            cy.triggerDeleteButton(".list-item:nth-child(2) .dynamic-delete-button")
            cy.get(".list-item").children().should("have.length", 3)
            cy.get(".list-item").contains('Koran 9:40').should("be.visible")
            cy.get(".list-item").contains('محمد رسول الله').should("be.visible")
            cy.get(".list-item").contains('Koran 22:1-9').should("be.visible")
            cy.get(".list-item").contains('Koran 30:4‒5').should("not.exist")
        })

        it("Still Deleted On Reload", function () {
            cy.visit("/editor/coin_verse")
            cy.get(".list-item").children().should("have.length", 3)
            cy.get(".list-item").contains('Koran 9:40').should("be.visible")
            cy.get(".list-item").contains('محمد رسول الله').should("be.visible")
            cy.get(".list-item").contains('Koran 22:1-9').should("be.visible")
            cy.get(".list-item").contains('Koran 30:4‒5').should("not.exist")
        })
    })
})