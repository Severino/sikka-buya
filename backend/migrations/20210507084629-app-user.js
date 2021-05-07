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
    name: {
      type: "string",
      unique: true,
      notNull: true
    },
    password: {
      type: "string",
      notNull: true
    },
    role: {
      type: "int",
      foreignKey: {
        name: "user_user_role_fk",
        table: "user_role",
        mapping: "id",
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
      }
    }
  });
};

exports.down = function (db) {
  return db.dropTable("app_user");
};

exports._meta = {
  "version": 1
};
