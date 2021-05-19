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
  return db.createTable("type_reviewed", {
    type: {
      type: 'int',
      unsigned: true,
      notNull: true,
      unique: true,
      foreignKey: {
        name: 'type_reviewed_type_id_fk',
        table: "type",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      }
    }
  });
};

exports.down = function (db) {
  return db.dropTable("type_reviewed");
};

exports._meta = {
  "version": 1
};
