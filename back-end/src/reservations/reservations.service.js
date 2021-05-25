const knex = require("../db/connection");
const tableName = "reservations";

async function list(reservation_date) {
  return knex(tableName)
    .where({ reservation_date })
    .orderBy("reservation_time");
}

function create(newReservation) {
  return knex(tableName).insert(newReservation).returning("*");
}

async function read(reservation_id) {
  return knex(tableName).where({ reservation_id }).first();
}

function search(mobile_number) {
  return knex(tableName)
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

async function update(updatedReservation) {
  return knex(tableName)
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then(() => read(updatedReservation.reservation_id));
}

module.exports = {
  list,
  create,
  read,
  search,
  update,
};
