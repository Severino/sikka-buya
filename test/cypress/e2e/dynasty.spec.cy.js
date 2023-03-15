describe("Testing Dynasty", function () {

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
        cy.get(".list-item").contains("Dynastie")
    })

    it("Navigate to List", function () {
        cy.visit('/editor')
        cy.get(".list-item").contains("Dynastie").click()
        cy.location("pathname").should((pathname) => {
            expect(pathname).to.eq("/editor/dynasty")
        })



        cy.get(".list-item").contains('Būyide')
        cy.get(".list-item").contains('ʿAbbāside')
    })

    it("Dynasty list is showing", function () {
        cy.visit('/editor/dynasty')
        cy.get(".list").children().should("have.length", 2)
    })

    it("List item is visible", function () {
        cy.visit('/editor/dynasty')
        cy.get(".list-item").contains('ʿAbbāside').should("be.visible")
    })

    it("Can filter", function () {
        cy.visit('/editor/dynasty')
        cy.get("input[type=search]").type("ūy")
        cy.get(".list-item").contains('Būyide')
        cy.get(".list").children().should("have.length", 1)
    })

    describe("Create Dynasty", function () {

        it("Can reach create page", function () {
            cy.visit("/editor/dynasty")
            cy.get("#create-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/dynasty/create")
            })
            cy.get("#dynasty-name").should("have.value", "")
        })


        it("Can cancel create", function () {
            cy.visit("/editor/dynasty/create")
            cy.get("#dynasty-name").type("xxxxx")
            cy.get("#cancel-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/dynasty")
            })
            cy.get(".list-item").contains('ʿAbbāside')
            cy.get(".list-item").contains('Būyide')
            cy.get(".list-item").children().should("have.length", 2)
        })

        it("Can create new honorific", function () {
            cy.visit("/editor/dynasty/create")
            cy.get("#dynasty-name").type("Bāwandide")
            cy.get("#submit-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/dynasty")
            })
            cy.get(".list-item").contains('ʿAbbāside')
            cy.get(".list-item").contains('Būyide')
            cy.get(".list-item").contains("Bāwandide")
            cy.get(".list-item").children().should("have.length", 3)
        })

    })

    describe("Edit Dynasty", function () {

        it("Access edit page", function () {
            cy.visit('/editor/dynasty')
            cy.get(".list-item").contains("Bāwandide").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/dynasty/3")
            })
            cy.get("#dynasty-name").should("have.value", "Bāwandide")
        })

        it("Cannot edit with wrong id", function () {
            cy.visit('/editor/dynasty/8')
            cy.get(".information.error").should("not.be.empty")
            cy.get("#submit-button").should("have.attr", "disabled")
        })


        it("Correct id set for update", function () {
            cy.visit('/editor/dynasty/3')
            cy.get("#dynasty-id").should("have.value", 3)
        })


        it("Can cancel update", function () {
            cy.visit('/editor/dynasty/3')
            cy.get("#dynasty-name").clear().type("xxxxxxxx")
            cy.get("#cancel-button").click()
            cy.get(".list-item").contains('ʿAbbāside')
            cy.get(".list-item").contains('Būyide')
            cy.get(".list-item").contains("Bāwandide")
            cy.get(".list-item").children().should("have.length", 3)
        })

        it("Can update", function () {
            cy.visit('/editor/dynasty/3')
            cy.get("#dynasty-name").clear().type("Fāṭimide")
            cy.get("#submit-button").click()
            cy.get(".list-item").contains('ʿAbbāside')
            cy.get(".list-item").contains('Būyide')
            cy.get(".list-item").contains("Fāṭimide")
            cy.get(".list").children().should("have.length", 3)
        })

    })


    describe("List Order", function () {
        it("List is in alphabetical order", function () {
            cy.visit("/editor/dynasty")
            cy.get('.list-item .list-item-cell')
                .then($items => {
                    const arr = $items.map((_, html) => Cypress.$(html).text()).get()
                    return arr
                })
                .should('deep.eq', ['ʿAbbāside', 'Būyide', "Fāṭimide"])
        })
    })

    describe("Delete Dynasty", function () {

        it("Delete", function () {
            cy.visit("/editor/dynasty")
            cy.triggerDeleteButton(".list-item:nth-child(3) .dynamic-delete-button")
            cy.get(".list-item").contains('ʿAbbāside')
            cy.get(".list-item").contains('Būyide')
            cy.get(".list-item").contains("Fāṭimide").should("not.exist")

        })

        it("Still Deleted On Reload", function () {
            cy.visit("/editor/dynasty")
            cy.get(".list-item").contains('ʿAbbāside')
            cy.get(".list-item").contains('Būyide')
            cy.get(".list-item").contains("Fāṭimide").should("not.exist")
        })
    })
})
