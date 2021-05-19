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

exports.up = function (db, callback) {
  return db.addColumn("type",
    "year_uncertain", { type: "boolean" },
    callback)
};

exports.down = function (db, callback) {
  return db.removeColumn("type",
    "year_uncertain",
    callback)
};

exports._meta = {
  "version": 1
};