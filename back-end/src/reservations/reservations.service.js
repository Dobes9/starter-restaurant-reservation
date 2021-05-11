const knex = require("../db/connection");
const tableName = "reservations";

async function list(reservation_date) {
  return knex(tableName).where({ reservation_date });
}

function create(newReservation) {
  return knex(tableName).insert(newReservation).returning("*");
}

module.exports = {
  list,
  create,
};
