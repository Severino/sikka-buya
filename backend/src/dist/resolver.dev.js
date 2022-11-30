"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Auth = require("./auth.js");

var _require = require("./utils/database.js"),
    Database = _require.Database,
    pgp = _require.pgp;

var Resolver =
/*#__PURE__*/
function () {
  function Resolver(name) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$tableName = _ref.tableName,
        tableName = _ref$tableName === void 0 ? null : _ref$tableName;

    _classCallCheck(this, Resolver);

    this.name = name;
    this.tableName = tableName ? tableName : this.name;
  }

  _createClass(Resolver, [{
    key: "add",
    value: function add(_, args, tableName) {
      return regeneratorRuntime.async(function add$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", this.request("INSERT INTO ".concat(tableName, " (").concat(Object.keys(args).join(","), ") VALUES (").concat(Object.keys(args).map(function (name) {
                return "$[".concat(name, "]");
              }), ")"), args));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "update",
    value: function update(_, args) {
      var id, query;
      return regeneratorRuntime.async(function update$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = args.id;

              if (!(!id || id <= 0)) {
                _context2.next = 3;
                break;
              }

              throw new Error("error.invalid_id");

            case 3:
              delete args.id;
              query = "UPDATE ".concat(this.tableName, " SET ").concat(Object.keys(args).map(function (val, idx) {
                return "".concat(val, "=$").concat(idx + 2);
              }), " WHERE id=$1");
              return _context2.abrupt("return", this.request(query, [id].concat(_toConsumableArray(Object.values(args)))));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "delete",
    value: function _delete(_, args) {
      return regeneratorRuntime.async(function _delete$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", Database.none("DELETE FROM ".concat(this.tableName, " WHERE id=$1"), [args.id]));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "get",
    value: function get(_, args) {
      return regeneratorRuntime.async(function get$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", Database.one("SELECT * FROM ".concat(this.tableName, " WHERE id=$1 "), [args.id]));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "list",
    value: function list(_) {
      var _ref2,
          language,
          langTable,
          _args5 = arguments;

      return regeneratorRuntime.async(function list$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _ref2 = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {}, language = _ref2.language;

              if (!(language && language.length < 4 && language != "de")) {
                _context5.next = 6;
                break;
              }

              langTable = "".concat(this.tableName, "_").concat(language);
              return _context5.abrupt("return", Database.manyOrNone("\n            SELECT a.id, \n            CASE WHEN b.name IS NOT NULL THEN b.name ELSE a.name END\n            FROM ".concat(this.tableName, " a\n            LEFT JOIN ").concat(langTable, " b ON a.id= b.id\n            ORDER BY a.name ASC\n            ")));

            case 6:
              return _context5.abrupt("return", Database.manyOrNone("SELECT * FROM ".concat(this.tableName, " ORDER BY ").concat(this.tableName, ".name ASC")));

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "search",
    value: function search(_, args) {
      return regeneratorRuntime.async(function search$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt("return", Database.any("SELECT * FROM ".concat(this.tableName, " WHERE unaccent(name) ILIKE unaccent($1) ORDER BY name ASC LIMIT ").concat(process.env.MAX_SEARCH), "%".concat(args.text, "%")));

            case 1:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "request",
    value: function request(query) {
      var params,
          _args7 = arguments;
      return regeneratorRuntime.async(function request$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              params = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : [];
              return _context7.abrupt("return", Database.any(query, params));

            case 2:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  }, {
    key: "capitalizedName",
    get: function get() {
      return this.name[0].toUpperCase() + this.name.substr(1);
    }
  }, {
    key: "resolvers",
    get: function get() {
      var resolvers = {
        Query: {},
        Mutation: {}
      };
      var ref = this;

      resolvers.Mutation["add".concat(this.capitalizedName)] = function (_, args, context) {
        Auth.verifyContext(context);
        return ref.add(_, args, ref.tableName);
      };

      resolvers.Mutation["update".concat(this.capitalizedName)] = function (_, args, context) {
        Auth.verifyContext(context);
        return ref.update(_, args, ref.tableName);
      };

      resolvers.Mutation["delete".concat(this.capitalizedName)] = function (_, args, context) {
        Auth.verifyContext(context);
        return ref["delete"](_, args, ref.tableName);
      };

      resolvers.Query["".concat(this.name)] = function (_, args, context) {
        return ref.list(_, args, context, ref.tableName);
      };

      resolvers.Query["get".concat(this.capitalizedName)] = function (_, args, context) {
        return ref.get(_, args, context, ref.tableName);
      };

      resolvers.Query["search".concat(this.capitalizedName)] = function (_, args, context) {
        return ref.search(_, args, context, ref.tableName);
      };

      return resolvers;
    }
  }]);

  return Resolver;
}();

module.exports = Resolver;