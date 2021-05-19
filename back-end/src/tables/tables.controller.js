const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  res.json({ data: await service.list() });
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

function tableNameHasAtLeast2Chars(req, res, next) {
  if (req.body.data.table_name.length >= 2) {
    return next();
  }
  next({
    status: 400,
    message: `Table name must be at least 2 characters long.`,
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
  const newTable = await service.create(req.body.data);

  res.status(201).json({
    data: newTable,
  });
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table cannot be found.`,
  });
}

function isTableOccupied(req, res, next) {
  if (res.locals.table.status === "free") {
    return next();
  }
  next({
    status: 400,
    message: `Table is currently occupied by another reservation.`,
  });
}

async function update(req, res) {}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    tableNameHasAtLeast2Chars,
    tableCanSeatAtLeastOnePerson,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    isTableOccupied,
    asyncErrorBoundary(update),
  ],
};
