"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('../utils/database'),
    Database = _require.Database,
    pgp = _require.pgp;

var BaseResolver = require("./base-resolver");

var MaterialResolver =
/*#__PURE__*/
function (_BaseResolver) {
  _inherits(MaterialResolver, _BaseResolver);

  function MaterialResolver() {
    _classCallCheck(this, MaterialResolver);

    return _possibleConstructorReturn(this, _getPrototypeOf(MaterialResolver).call(this, "material"));
  }

  _createClass(MaterialResolver, [{
    key: "add",
    value: function add(_, args, tableName) {
      return regeneratorRuntime.async(function add$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _get(_getPrototypeOf(MaterialResolver.prototype), "argumentGuard", this).call(this, "name", args);

              return _context2.abrupt("return", Database.tx(function _callee(t) {
                var _ref, id;

                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return regeneratorRuntime.awrap(t.one("INSERT INTO material (name) VALUES ($1)  RETURNING id;", args.name));

                      case 2:
                        _ref = _context.sent;
                        id = _ref.id;

                        if (!args.color) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 7;
                        return regeneratorRuntime.awrap(t.none("INSERT INTO material_color (material, color) VALUES ($1, $2)", [id, args.color]));

                      case 7:
                        return _context.abrupt("return", id);

                      case 8:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "update",
    value: function update(_, args) {
      return regeneratorRuntime.async(function update$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _get(_getPrototypeOf(MaterialResolver.prototype), "argumentGuard", this).call(this, "id", args);

              return _context3.abrupt("return", Database.tx(function (t) {
                if (args.name) {
                  t.none("UPDATE material SET name=$[name] WHERE id=$[id]", args);
                }

                if (args.color) {
                  t.none("\n                INSERT INTO material_color (material, color) VALUES ($[id], $[color]) ON CONFLICT (material) DO UPDATE SET color=$[color]\n                ", args);
                }
              }));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "delete",
    value: function _delete(_, args) {
      return regeneratorRuntime.async(function _delete$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _get(_getPrototypeOf(MaterialResolver.prototype), "argumentGuard", this).call(this, "id", args);

              return _context4.abrupt("return", Database.none("DELETE FROM material WHERE id=$1", args.id));

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createListQuery",
    value: function createListQuery() {
      return pgp.as.format("SELECT *, material_color.color AS color FROM material \n        LEFT JOIN material_color ON material_color.material = material.id\n        ");
    }
  }, {
    key: "get",
    value: function get(_, args) {
      return regeneratorRuntime.async(function get$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _get(_getPrototypeOf(MaterialResolver.prototype), "argumentGuard", this).call(this, "id", args);

              return _context5.abrupt("return", Database.oneOrNone("\n        ".concat(this.createListQuery(), "\n        WHERE id=$1\n        "), args.id));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "list",
    value: function list(_) {
      var _ref2,
          language,
          query,
          _args6 = arguments;

      return regeneratorRuntime.async(function list$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _ref2 = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {}, language = _ref2.language;
              query = "".concat(this.createListQuery(), " ORDER BY material.name");
              return _context6.abrupt("return", Database.manyOrNone(query));

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }]);

  return MaterialResolver;
}(BaseResolver);

module.exports = MaterialResolver;