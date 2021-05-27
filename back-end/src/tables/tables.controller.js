const TablesService = require("./tables.service");
const ReservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  res.json({ data: await TablesService.list() });
}

function read(req, res) {
  res.json({ data: res.locals.table });
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: `Body must have a data property.`,
  });
}

function tableNamePropExists(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name) {
    return next();
  }
  next({
    status: 400,
    message: `table_name`,
  });
}

function tableNameHasAtLeast2Chars(req, res, next) {
  if (req.body.data.table_name.length >= 2) {
    return next();
  }
  next({
    status: 400,
    message: `table_name`,
  });
}

function tableCanSeatAtLeastOnePerson(req, res, next) {
  if (req.body.data.capacity >= 1) {
    return next();
  }
  next({
    status: 400,
    message: `Table must have a capacity of at least 1.`,
  });
}

async function create(req, res) {
  const newTable = await TablesService.create(req.body.data);

  res.status(201).json({
    data: newTable,
  });
}

async function tableExists(req, res, next) {
  const table = await TablesService.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `${req.params.table_id}`,
  });
}

function isTableFree(req, res, next) {
  if (res.locals.table.status === "free") {
    return next();
  }
  next({
    status: 400,
    message: `Table is currently occupied by another reservation.`,
  });
}

async function isTableCapacityGreaterThanReservationSize(req, res, next) {
  const reservation = await ReservationsService.read(
    req.body.data.reservation_id
  );
  if (res.locals.table.capacity >= reservation.people) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 400,
    message: `Table capacity must be greater than or equal to reservation party size.`,
  });
}

async function update(req, res) {
  const updatedTable = {
    ...res.locals.table,
    status: "occupied",
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await TablesService.update(updatedTable);
  res.json({ data });
}

function isTableOccupied(req, res, next) {
  if (res.locals.table.status === "occupied") {
    return next();
  }
  next({
    status: 400,
    message: `Table is currently free.`,
  });
}

async function destroy(req, res) {
  const updatedTable = {
    ...res.locals.table,
    status: "free",
    reservation_id: null,
  };
  const data = await TablesService.update(updatedTable);
  res.status(204).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), read],
  create: [
    hasData,
    tableNamePropExists,
    tableNameHasAtLeast2Chars,
    tableCanSeatAtLeastOnePerson,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    isTableFree,
    asyncErrorBoundary(isTableCapacityGreaterThanReservationSize),
    asyncErrorBoundary(update),
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    isTableOccupied,
    asyncErrorBoundary(destroy),
  ],
};
