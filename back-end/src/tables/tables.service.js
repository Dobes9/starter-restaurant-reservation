const knex = require("../db/connection");
const tableName = "tables";

async function list() {
  return knex(tableName);
}

function create(newTable) {
  return knex(tableName).insert(newTable).returning("*");
}

module.exports = {
  list,
  create,
};
