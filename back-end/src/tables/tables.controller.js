const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  res.json({ data: await service.list() });
}

async function create(req, res) {
  const newTable = await service.create(req.body.data);

  res.status(201).json({
    data: newTable,
  });
}

async function update(req, res) {}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(update)],
};
