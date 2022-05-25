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
        console.log("login: ", response)
        let { user, token } = response?.body?.data?.login

        if (!token) throw new Error("Could not login!")
        window.localStorage.setItem("auth-jwt-token", token)
        window.localStorage.setItem("auth-user", JSON.stringify(user))

    })

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
