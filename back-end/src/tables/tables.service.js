const knex = require("../db/connection");
const tableName = "tables";

async function list() {
  return knex(tableName);
}

function create(newTable) {
  return knex(tableName).insert(newTable).returning("*");
}

async function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

module.exports = {
  list,
  create,
  read,
};
