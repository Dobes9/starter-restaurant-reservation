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

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: `Body must have a data property`,
  });
}

function hasFirstName(req, res, next) {
  const { first_name } = req.body.data;
  if (first_name) {
    return next();
  }
  next({
    status: 400,
    message: `Reservation must have a first name`,
  });
}

function hasLastName(req, res, next) {
  const { last_name } = req.body.data;
  if (last_name) {
    return next();
  }
  next({
    status: 400,
    message: `Reservation must have a last name`,
  });
}

function hasMobileNumber(req, res, next) {
  const { mobile_number } = req.body.data;
  if (mobile_number) {
    return next();
  }
  next({
    status: 400,
    message: `Reservation must have a mobile number`,
  });
}

function hasNumOfPeople(req, res, next) {
  const { people } = req.body.data;
  if (people >= 1) {
    return next();
  }
  next({
    status: 400,
    message: `Reservation must have at least 1 person`,
  });
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasNumOfPeople,
    asyncErrorBoundary(create),
  ],
};
