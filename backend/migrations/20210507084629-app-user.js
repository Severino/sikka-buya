'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("app_user", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    name: {
      type: "string",
      unique: true
    },
    email: {
      type: "string",
      unique: true,
      notNull: true
    },
    password: {
      type: "string"
    }, super: {
      type: "boolean",
      default: false
    }
  });
};

exports.down = function (db) {
  return db.dropTable("app_user");
};

exports._meta = {
  "version": 1
};
