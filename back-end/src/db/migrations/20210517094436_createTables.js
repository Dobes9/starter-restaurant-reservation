exports.up = function (knex) {
  return knex.createTable("tables", (table) => {
    table.increments("table_id").primary();
    table.string("table_name");
    table.integer("capacity");
    table.string("status").defaultTo("Free");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};
