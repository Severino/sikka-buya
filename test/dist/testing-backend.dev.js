"use strict";

var _require = require('./tasks/setup.js'),
    resetTestDatabase = _require.resetTestDatabase;

var _require2 = require("path"),
    joinPath = _require2.join;

var start = require('../backend/express.js');

function verifyAllEnvVariablesAreSet() {
  var missingEnv = [];
  var envs = ["DB_SUPER_NAME", "DB_SUPER_USER", "DB_SUPER_PASSWORD", "DB_USER", "DB_PASSWORD", "DB_NAME", "DB_HOST", "DB_PORT", "JWT_SECRET", "MAX_SEARCH"];
  envs.forEach(function (env) {
    if (!process.env[env]) missingEnv.push(env);
  });
  if (missingEnv.length > 0) throw new Error("Missing env variables: ".concat(missingEnv.join(", "), ". Set them in the .env file in the test directory."));
}

function main() {
  var handler;
  return regeneratorRuntime.async(function main$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          handler = function _ref(req, res, next) {
            var status, message, method;
            return regeneratorRuntime.async(function handler$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    res.setHeader('Content-Type', 'application/json');
                    status = 200;
                    message = "";
                    _context.prev = 3;
                    method = req.body.method;

                    if (method) {
                      _context.next = 10;
                      break;
                    }

                    status = 400;
                    message = "Parameter 'method' missing";
                    _context.next = 24;
                    break;

                  case 10:
                    _context.t0 = method;
                    _context.next = _context.t0 === "ResetDatabase" ? 13 : _context.t0 === "MountMinimalDatabase" ? 16 : _context.t0 === "MountMinimalDatabaseWithCreatedType" ? 19 : 22;
                    break;

                  case 13:
                    _context.next = 15;
                    return regeneratorRuntime.awrap(resetTestDatabase());

                  case 15:
                    return _context.abrupt("break", 24);

                  case 16:
                    _context.next = 18;
                    return regeneratorRuntime.awrap(resetTestDatabase(joinPath(__dirname, "mockdata", "minimal-filled-database.sql")));

                  case 18:
                    return _context.abrupt("break", 24);

                  case 19:
                    _context.next = 21;
                    return regeneratorRuntime.awrap(resetTestDatabase(joinPath(__dirname, "mockdata", "minimal-filled-database-with-created-type.sql")));

                  case 21:
                    return _context.abrupt("break", 24);

                  case 22:
                    status = 400;
                    message = "Unknown method ".concat(method);

                  case 24:
                    _context.next = 30;
                    break;

                  case 26:
                    _context.prev = 26;
                    _context.t1 = _context["catch"](3);
                    status = 500;
                    message = _context.t1.message;

                  case 30:
                    res.status(status).end(JSON.stringify({
                      status: status,
                      message: message
                    }));

                  case 31:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[3, 26]]);
          };

          if (!process.env.useCli) {
            require("dotenv").config();
          }

          verifyAllEnvVariablesAreSet();
          process.env.expressPort = 4000;
          process.env.jwtSecret = "secret";
          _context2.next = 7;
          return regeneratorRuntime.awrap(start(Object.assign({}, process.env, {
            routes: [{
              route: "/test-database",
              handler: handler
            }]
          })));

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}

main().then()["catch"](console.error);