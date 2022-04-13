"use strict";

/**
 * This script requires psql to work with the 
 * '--no-password' flag. You may use the 
 * 'generate_pgpass' script.
 * 
 * It's explained here how to set it up:
 * https://www.postgresql.org/docs/current/libpq-pgpass.html
 */
try {
  require("dotenv").config();
} catch (e) {
  Message.error("Create an .env file. Check the README.md for required values.");
}

var _require = require("../src/utils/database"),
    pgp = _require.pgp;

var path = require('path');

var readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

var _require2 = require('util'),
    promisify = _require2.promisify;

var Message = require('./modules/logging');

var chalk = require('chalk');

var question = promisify(readline.question).bind(readline);
var exec = promisify(require("child_process").exec);

function databaseExists(db) {
  var result;
  return regeneratorRuntime.async(function databaseExists$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1);", [process.env.DB_NAME]));

        case 2:
          result = _context.sent;
          return _context.abrupt("return", result.length !== 0);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

function createDatabase(db) {
  return regeneratorRuntime.async(function createDatabase$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            db.result("CREATE Database $1:name OWNER $2:name", [process.env.DB_NAME, process.env.DB_USER]).then(function () {
              Message.success("Database '".concat(process.env.DB_NAME, "' was created successfully...."));
              resolve(true);
            })["catch"](function (error) {
              Message.error(error);
              reject(error);
            });
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function applySchema() {
  var schemaFilePath, child_process;
  return regeneratorRuntime.async(function applySchema$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          schemaFilePath = path.join(__dirname, "..", "schema.sql");
          Message.notice("\nApplying schema file ".concat(schemaFilePath, " ..."));
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(exec("psql --no-password -U ".concat(process.env.DB_USER, " -d ").concat(process.env.DB_NAME, " -f ").concat(schemaFilePath)));

        case 5:
          child_process = _context3.sent;
          if (child_process.stdout) Message.log("stdout: ".concat(child_process.stdout));
          if (child_process.stderr) Message.warn("stderr: ".concat(child_process.stderr));
          if (child_process.stderr) Message.warn("Schema was applied. You may find problems and errors above.");else Message.success("Scheme was applied without any errors!");
          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](2);
          Message.error(_context3.t0);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 11]]);
}

function userExists(db) {
  var result;
  return regeneratorRuntime.async(function userExists$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(db.result("SELECT 1 FROM pg_roles WHERE rolname=$[user]", {
            user: process.env.DB_USER
          }));

        case 2:
          result = _context4.sent;
          return _context4.abrupt("return", result.rows.length > 0);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function createUser(db) {
  return regeneratorRuntime.async(function createUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(db.none("CREATE USER $[user:name] SUPERUSER PASSWORD $[password]", {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
          }));

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
}

;

(function _callee() {
  var super_pw, root_db;
  return regeneratorRuntime.async(function _callee$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(question(chalk.bold.yellow("\n!!! WARNING !!!\nThis script will create a new DATABASE and a SUPERUSER as specified in your .env file!\nIf you are sure that you want to proceed insert your \npostgres admin password (the password of the user 'postgres'):\n")));

        case 2:
          super_pw = _context6.sent;
          root_db = pgp({
            user: "postgres",
            host: process.env.DB_HOST,
            database: "postgres",
            password: super_pw,
            port: process.env.DB_PORT
          });
          _context6.prev = 4;
          _context6.next = 7;
          return regeneratorRuntime.awrap(userExists(root_db));

        case 7:
          if (!_context6.sent) {
            _context6.next = 11;
            break;
          }

          Message.warn("User ".concat(process.env.DB_USER, " already exists."));
          _context6.next = 14;
          break;

        case 11:
          Message.notice("Creating user '".concat(process.env.DB_USER, "' ..."));
          _context6.next = 14;
          return regeneratorRuntime.awrap(createUser(root_db));

        case 14:
          _context6.next = 16;
          return regeneratorRuntime.awrap(databaseExists(root_db));

        case 16:
          if (!_context6.sent) {
            _context6.next = 20;
            break;
          }

          Message.warn("Database '".concat(process.env.DB_NAME, "' already exists."));
          _context6.next = 23;
          break;

        case 20:
          Message.notice("Creating '".concat(process.env.DB_NAME, "' ..."));
          _context6.next = 23;
          return regeneratorRuntime.awrap(createDatabase(root_db));

        case 23:
          _context6.next = 25;
          return regeneratorRuntime.awrap(applySchema());

        case 25:
          Message.notice("Setup script finished successfully.");
          _context6.next = 31;
          break;

        case 28:
          _context6.prev = 28;
          _context6.t0 = _context6["catch"](4);
          Message.error("Setup exited with errors: ".concat(_context6.t0));

        case 31:
          process.exit();

        case 32:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[4, 28]]);
})();