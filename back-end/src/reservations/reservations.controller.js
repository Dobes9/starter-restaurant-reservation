/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  if (date) {
    res.json({
      data: await service.list(date),
    });
  } else if (mobile_number) {
    res.json({
      data: await service.search(mobile_number),
    });
  }
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

function hasReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;
  if (reservation_date) {
    res.locals.reservation_date = reservation_date;
    return next();
  }
  next({
    status: 400,
    message: `Reservation must have a date`,
  });
}

function reservationNotOnTuesdays(req, res, next) {
  const reservationDate = new Date(res.locals.reservation_date);
  if (reservationDate.getUTCDay === 2) {
    next({
      status: 400,
      message: `Reservation cannot be made for a Tuesday`,
    });
  }
  return next();
}

function reservationForAFutureDate(req, res, next) {
  const reservationDate = new Date(
    `${res.locals.reservation_date}T${res.locals.reservation_time}:00.000`
  );
  const todaysDate = new Date();
  if (reservationDate < todaysDate) {
    next({
      status: 400,
      message: `Reservation cannot be made for a date in the past`,
    });
  }
  return next();
}

function hasReservationTime(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time) {
    res.locals.reservation_time = reservation_time;
    return next();
  }
  next({
    status: 400,
    message: `Reservation must have a time`,
  });
}

function reservationTimeAfterOpen(req, res, next) {
  const reservationTime = new Date(res.locals.reservation_time);
  if (
    reservationTime.getHours() < 10 ||
    (reservationTime.getHours() === 10 && reservationTime.getMinutes() < 30)
  ) {
    next({
      status: 400,
      message: `Reservation must be made for after 10:30 AM`,
    });
  }
  return next();
}

function reservationTimeOneHourBeforeClose(req, res, next) {
  const reservationTime = new Date(res.locals.reservation_time);
  if (
    reservationTime.getHours() > 21 ||
    (reservationTime.getHours() === 21 && reservationTime.getMinutes() > 30)
  ) {
    next({
      status: 400,
      message: `Reservation must be made for at least an hour before close (10:30 PM)`,
    });
  }
  return next();
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

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.body.data.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation cannot be found.`,
  });
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function updateStatus(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    reservationForAFutureDate,
    reservationNotOnTuesdays,
    reservationTimeAfterOpen,
    reservationTimeOneHourBeforeClose,
    hasNumOfPeople,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
  ],
};
