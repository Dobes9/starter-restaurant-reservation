/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const date = req.query.date;
  res.json({
    data: await service.list(date),
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
