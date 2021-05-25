const knex = require("../db/connection");
const tableName = "tables";

async function list() {
  return knex(tableName).orderBy("table_name");
}

function create(newTable) {
  return knex(tableName).insert(newTable).returning("*");
}

async function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

async function update(table) {
  return knex(tableName)
    .where({ table_id: table.table_id })
    .update(table, "*")
    .then(() => read(table.table_id));
}

module.exports = {
  list,
  create,
  read,
  update,
};
