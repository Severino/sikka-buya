describe("Testing Honorifics", function () {

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
        cy.get(".list-item").contains("Ehrenname")
    })

    it("Navigate to List", function () {
        cy.get(".list-item").contains("Ehrenname").click()
        cy.location("pathname").should((pathname) => {
            expect(pathname).to.eq("/editor/honorific")
        })
        cy.get(".list-item").contains("… ad-Daula")
        cy.get(".list-item").contains("… al-Mulūk")
    })

    it("Honorific list is showing", function () {
        cy.visit('/editor/honorific')
        cy.get(".list").children().should("have.length", 2)
    })

    it("List item is visible", function () {
        cy.visit('/editor/honorific')
        cy.get(".list-item").contains("… ad-Daula").should("be.visible")
    })

    it("Can filter", function () {
        cy.visit('/editor/honorific')
        cy.get("input[type=search]").type("lūk")
        cy.get(".list-item").contains("… al-Mulūk")
        cy.get(".list").children().should("have.length", 1)
    })

    describe("Create Honorific", function () {

        it("Can reach create page", function () {
            cy.visit("/editor/honorific")
            cy.get("#create-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/honorific/create")
            })
            cy.get("#honorific-name").should("have.value", "")
        })


        it("Can cancel create", function () {
            cy.visit("/editor/honorific/create")
            cy.get("#honorific-name").type("xxxxx")
            cy.get("#cancel-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/honorific")
            })
            cy.get(".list-item").contains("… al-Mulūk")
            cy.get(".list-item").contains("… ad-Daula")
            cy.get(".list-item").children().should("have.length", 2)
        })

        it("Can create new honorific", function () {
            cy.visit("/editor/honorific/create")
            cy.get("#honorific-name").type("… fi ’d-Dunyā wa-’d-Dīn")
            cy.get("#submit-button").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/honorific")
            })
            cy.get(".list-item").contains("… al-Mulūk")
            cy.get(".list-item").contains("… ad-Daula")
            cy.get(".list-item").contains("… fi ’d-Dunyā wa-’d-Dīn")
            cy.get(".list-item").children().should("have.length", 3)
        })

    })

    describe("Edit Honorific", function () {

        it("Access edit page", function () {
            cy.visit('/editor/honorific')
            cy.get(".list-item").contains("… fi ’d-Dunyā wa-’d-Dīn").click()
            cy.location("pathname").should((pathname) => {
                expect(pathname).to.eq("/editor/honorific/4")
            })
            cy.get("#honorific-name").should("have.value", "… fi ’d-Dunyā wa-’d-Dīn")
        })

        it("Cannot edit with wrong id", function () {
            cy.visit('/editor/honorific/8')
            cy.get(".information.error").should("not.be.empty")
            cy.get("button").contains("senden").should("have.attr", "disabled")
        })


        it("Correct id set for update", function () {
            cy.visit('/editor/honorific/4')
            cy.get("#honorific-id").should("have.value", 4)
        })


        it("Can cancel update", function () {
            cy.visit('/editor/honorific/4')
            cy.get("#honorific-name").clear().type("xxxxxxxx")
            cy.get("#cancel-button").click()
            cy.get(".list-item").contains("… al-Mulūk")
            cy.get(".list-item").contains("… ad-Daula")
            cy.get(".list-item").contains("… fi ’d-Dunyā wa-’d-Dīn")
            cy.get(".list-item").children().should("have.length", 3)
        })

        it("Can update", function () {
            cy.visit('/editor/honorific/4')
            cy.get("#honorific-name").clear().type("… Dīn Allāh")
            cy.get("#submit-button").click()
            cy.get(".list-item").contains("… al-Mulūk")
            cy.get(".list-item").contains("… ad-Daula")
            cy.get(".list-item").contains("… Dīn Allāh")
            cy.get(".list").children().should("have.length", 3)
        })
    })

    describe("List Order", function () {

        it("List is in alphabetical order", function () {
            cy.visit("/editor/honorific")
            cy.get('.list-item .cell')
                .then($items => {
                    const arr = $items.map((_, html) => Cypress.$(html).text()).get()
                    return arr
                })
                .should('deep.eq', ["… ad-Daula", "… al-Mulūk", "… Dīn Allāh"])
        })
    })

    describe("Delete Honorific", function () {
        it("Delete", function () {
            cy.visit("/editor/honorific")
            cy.triggerDeleteButton(".list-item:nth-child(3) .dynamic-delete-button")
            cy.get(".list-item").contains("… al-Mulūk")
            cy.get(".list-item").contains("… ad-Daula")
            cy.get(".list-item").contains("… Dīn Allāh").should("not.exist")

        })

        it("Still Deleted On Reload", function () {
            cy.visit("/editor/honorific")
            cy.get(".list-item").contains("… al-Mulūk")
            cy.get(".list-item").contains("… ad-Daula")
            cy.get(".list-item").contains("… Dīn Allāh").should("not.exist")
        })
    })
})