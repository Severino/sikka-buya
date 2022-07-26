const axios = require('axios')

module.exports = {
  // The rest of the Cypress config options go here...
  projectId: "jzfi3q",
  e2e: {
    baseUrl: "http://localhost:8080",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        async ResetDatabase() {
          axios.post("http://localhost:4000/test-database", {
            method: "ResetDatabase"
          })

          return true
        },
        async MountMinimalDatabase() {
          await axios.post("http://localhost:4000/test-database", {
            method: "MountMinimalDatabase"
          })

          return true
        },
        async MountMinimalDatabaseWithCreatedType() {
          await axios.post("http://localhost:4000/test-database", {
            method: "MountMinimalDatabaseWithCreatedType"
          })

          return true
        }
      })
    },
  },
};