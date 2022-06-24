"use strict";

/// <reference types="cypress" />
var axios = require('axios'); // ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars


module.exports = function (on, config) {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    ResetDatabase: function ResetDatabase() {
      return regeneratorRuntime.async(function ResetDatabase$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              axios.post("http://localhost:4000/test-database", {
                method: "ResetDatabase"
              });
              return _context.abrupt("return", true);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    MountMinimalDatabase: function MountMinimalDatabase() {
      return regeneratorRuntime.async(function MountMinimalDatabase$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(axios.post("http://localhost:4000/test-database", {
                method: "MountMinimalDatabase"
              }));

            case 2:
              return _context2.abrupt("return", true);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    MountMinimalDatabaseWithCreatedType: function MountMinimalDatabaseWithCreatedType() {
      return regeneratorRuntime.async(function MountMinimalDatabaseWithCreatedType$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(axios.post("http://localhost:4000/test-database", {
                method: "MountMinimalDatabaseWithCreatedType"
              }));

            case 2:
              return _context3.abrupt("return", true);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  });
};