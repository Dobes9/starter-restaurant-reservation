const knex = require("../db/connection");
const tableName = "reservations";

async function list(date) {
  return knex(tableName).where({ reservation_date: date });
}

module.exports = {
  list,
};
