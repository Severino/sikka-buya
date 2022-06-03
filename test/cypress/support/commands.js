// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import "cypress-localstorage-commands";

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
    cy.request({
        method: "GET",
        url: "http://localhost:4000/graphql",
        body: {
            query: `{login(email: "${email}", password: "${password}"){
                success
                message
                token
                user {
                    id
                    email
                    super
                }
            }}`
        }
    }).then(response => {
        let { user, token } = response?.body?.data?.login

        if (!token) throw new Error("Could not login!")

        cy.setLocalStorage("auth-jwt-token", token)
        cy.setLocalStorage("auth-user", JSON.stringify(user))
        cy.saveLocalStorage()
    })
})

Cypress.Commands.add("triggerDeleteButton", (selector) => {
    const deleteButton = cy.get(selector)

    deleteButton.then(el => {
        const rect = el[0].getBoundingClientRect()
        const clickPosition = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        }

        deleteButton
            .trigger("mousedown", { which: 1, pageX: clickPosition.x, pageX: clickPosition.y })
            .wait(500)
            .trigger("mousemove", { which: 1, pageX: clickPosition.x + 140, pageX: clickPosition.y })
            .wait(200)
            .trigger("mouseup")
    })
})


Cypress.Commands.add("clearDataSelect", (selector) => {
    const dataSelect = cy.get(selector)
    dataSelect.find("#clear-btn").click()
})

Cypress.Commands.add("selectFromDataSelect", (selector, targetText, type = "") => {
    const dataSelect = cy.get(selector).clear()

    if (type !== "") {
        dataSelect.type(type)
    }

    dataSelect.then(el => {
        const rect = el[0].getBoundingClientRect()
        const clickPosition = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        }

        dataSelect.click()

        dataSelect.find(".search-box li").contains(targetText).then((el) => {
            const targetRect = el[0].getBoundingClientRect()
            const targetPosition = {
                x: targetRect.x + targetRect.width / 2,
                y: targetRect.y + targetRect.height / 2
            }
            dataSelect
                .trigger("mousemove", { which: 1, pageX: targetPosition.x, pageX: targetPosition.y })
                .wait(200)
                .trigger("click")
        })
    })
})

Cypress.Commands.add("checkDataSelect", (selector, name = "", value = "") => {
    cy.get(selector).find(`.name-field`).should("have.value", name)
    cy.get(selector).find(`.data-select-id`).should("have.value", value)

})


//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
