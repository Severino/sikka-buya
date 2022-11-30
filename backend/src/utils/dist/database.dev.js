"use strict";

require("dotenv").config();

var pgp = require("pg-promise")({
  // This logs the queries that are executed
  query: function query(e) {// console.log(e);
  }
});

if (!process.env.DB_USER) {
  throw new Error("Make sure to run the script from the root of the project, that contains the .env file.");
}

var Database = pgp({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
var QueryFileMap = {};

function getQueryFile(key) {
  return QueryFileMap[key] || null;
}

function addQueryFile(key, queryFile) {
  QueryFileMap[key] = queryFile;
}

module.exports = {
  Database: Database,
  pgp: pgp,
  QueryFile: pgp.QueryFile,
  getQueryFile: getQueryFile,
  addQueryFile: addQueryFile
};