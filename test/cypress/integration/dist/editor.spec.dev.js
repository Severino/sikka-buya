"use strict";

var _coin_mark = _interopRequireDefault(require("./editor/coin_mark"));

var _dynasty = _interopRequireDefault(require("./editor/dynasty"));

var _honorific = _interopRequireDefault(require("./editor/honorific"));

var _material = _interopRequireDefault(require("./editor/material"));

var _mint = _interopRequireDefault(require("./editor/mint"));

var _nominal = _interopRequireDefault(require("./editor/nominal"));

var _person = _interopRequireDefault(require("./editor/person"));

var _province = _interopRequireDefault(require("./editor/province"));

var _role = _interopRequireDefault(require("./editor/role"));

var _title = _interopRequireDefault(require("./editor/title"));

var _type = _interopRequireDefault(require("./editor/type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Testing Editor Pages', function () {
  var user;
  this.beforeAll(function () {
    cy.task("MountMinimalDatabase");
    cy.fixture("users/admin").then(function (_user) {
      user = _user;
      cy.login(user.email, user.password);
    });
  });
  this.beforeEach(function () {
    cy.restoreLocalStorage();
  }); // describe("Coin Mark", coin_mark.bind(this))
  // describe("Dynasty", dynasty.bind(this))
  // describe("Honorific", honorific.bind(this))
  // describe("Material", material.bind(this))
  // describe("Mint", mint.bind(this))
  // describe("Nominal", nominal.bind(this))
  // describe("Person", person.bind(this))
  // describe("Provinz", province.bind(this))
  // describe("Role", role.bind(this))
  // describe("Title", title.bind(this))

  describe("Type", _type["default"].bind(this));
});