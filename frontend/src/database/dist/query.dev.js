"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _AxiosHelper = _interopRequireDefault(require("@/utils/AxiosHelper.js"));

var _Auth = _interopRequireDefault(require("../utils/Auth"));

var _host = require("./host");

var _printer = require("graphql/language/printer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Query =
/*#__PURE__*/
function () {
  function Query(name) {
    _classCallCheck(this, Query);

    this.name = name;
  }

  _createClass(Query, [{
    key: "get",
    value: function get(id, properties) {
      var query;
      return regeneratorRuntime.async(function get$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = "\n              {\n                get".concat(this.capitalizedName, " (id:").concat(id, ")  {\n                    ").concat(properties.join(","), "\n                }\n              }\n            ");
              return _context.abrupt("return", Query.raw(query));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "raw",
    value: function raw(query, variables) {
      return regeneratorRuntime.async(function raw$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", Query.raw(query, variables));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "update",
    value: function update(data) {
      var properties, _i, _Object$entries, _Object$entries$_i, key, val, fixedValue, queryName;

      return regeneratorRuntime.async(function update$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (data.id == -1) delete data.id;
              properties = "";

              for (_i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
                _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], val = _Object$entries$_i[1];
                fixedValue = typeof val == "string" ? "\"".concat(val, "\"") : Array.isArray(val) ? "[".concat(val.join(","), "]") : val;
                properties += key + ":" + fixedValue + ",\n";
              }

              properties = properties.slice(0, -2);
              queryName = data.id ? "update" : "add";
              return _context3.abrupt("return", this.raw("mutation {\n            ".concat(queryName).concat(this.capitalizedName, "(").concat(properties, ")\n          }\n        ")));

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var query = "\n        mutation {\n          delete".concat(this.capitalizedName, "(\n            id: ").concat(id, "\n          )\n        }\n      ");
      return this.raw(query);
    }
  }, {
    key: "list",
    value: function list(properties) {
      var query;
      return regeneratorRuntime.async(function list$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              query = "{\n          ".concat(this.name, " {\n              ").concat(properties.join(","), "\n          }\n        }\n      ");
              return _context4.abrupt("return", Query.raw(query));

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "capitalizedName",
    get: function get() {
      return this.name[0].toUpperCase() + this.name.substr(1);
    }
  }], [{
    key: "gql",
    value: function gql(query, variables) {
      var string;
      return regeneratorRuntime.async(function gql$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              string = (0, _printer.print)(query);
              return _context5.abrupt("return", this.raw(string, variables));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "raw",
    value: function raw(query) {
      var variables,
          _args6 = arguments;
      return regeneratorRuntime.async(function raw$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              variables = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
              return _context6.abrupt("return", new Promise(function (resolve, reject) {
                var timeout = setTimeout(function () {
                  reject('Operation timed out.');
                }, 5000);
                (0, _axios["default"])({
                  url: _host.graphqlEndpoint,
                  method: "post",
                  headers: {
                    "auth": _Auth["default"].loadToken()
                  },
                  data: {
                    query: query,
                    variables: variables
                  }
                }).then(function (result) {
                  if (_AxiosHelper["default"].ok(result)) {
                    resolve(result);
                  } else {
                    var errors = _AxiosHelper["default"].getErrors(result);

                    reject(errors);
                  }
                })["catch"](function (e) {
                  if (e.isAxiosError) {
                    console.error(e.response.data.errors[0]);
                    reject(e.response.data.errors.map(function (item) {
                      return item.message;
                    }).join(" --- "));
                  } else reject(e);
                })["finally"](function () {
                  return clearTimeout(timeout);
                });
              }));

            case 2:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }]);

  return Query;
}();

exports["default"] = Query;