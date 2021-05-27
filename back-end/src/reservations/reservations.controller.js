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
    message: `first_name`,
  });
}

function hasLastName(req, res, next) {
  const { last_name } = req.body.data;
  if (last_name) {
    return next();
  }
  next({
    status: 400,
    message: `last_name`,
  });
}

function hasMobileNumber(req, res, next) {
  const { mobile_number } = req.body.data;
  if (mobile_number) {
    return next();
  }
  next({
    status: 400,
    message: `mobile_number`,
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
    message: `reservation_date`,
  });
}

function reservationNotOnTuesdays(req, res, next) {
  const reservationDate = new Date(res.locals.reservation_date);
  if (reservationDate.getUTCDay() === 2) {
    next({
      status: 400,
      message: `closed`,
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
      message: `future`,
    });
  }
  return next();
}

function hasReservationTime(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time) {
    return next();
  }
  next({
    status: 400,
    message: `reservation_time`,
  });
}

function reservationTimeAfterOpen(req, res, next) {
  const reservationTime = new Date(req.body.data.reservation_time);
  if (
    reservationTime.getHours() < 10 ||
    (reservationTime.getHours() === 10 && reservationTime.getMinutes() < 30)
  ) {
    next({
      status: 400,
      message: `reservation_time`,
    });
  }
  return next();
}

function reservationTimeOneHourBeforeClose(req, res, next) {
  const reservationTime = new Date(req.body.data.reservation_time);
  if (
    reservationTime.getHours() > 21 ||
    (reservationTime.getHours() === 21 && reservationTime.getMinutes() > 30)
  ) {
    next({
      status: 400,
      message: `reservation_time`,
    });
  }
  return next();
}

function peoplePropIsANumber(req, res, next) {
  const { people } = req.body.data;
  if (typeof people === "number") {
    return next();
  }
  next({
    status: 400,
    message: `people`,
  });
}

function hasNumOfPeople(req, res, next) {
  const { people } = req.body.data;
  if (people >= 1) {
    return next();
  }
  next({
    status: 400,
    message: `people`,
  });
}

function hasStatusProp(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    return next();
  }
  next({
    status: 400,
    message: `status`,
  });
}

function isStatusSeated(req, res, next) {
  const { status } = req.body.data;
  if (status === "seated") {
    next({
      status: 400,
      message: `seated`,
    });
  }
  return next();
}

function isStatusFinished(req, res, next) {
  const { status } = req.body.data;
  if (status === "finished") {
    next({
      status: 400,
      message: `finished`,
    });
  }
}

async function create(req, res) {
  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  });
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `${req.params.reservation_id}`,
  });
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

function validStatus(req, res, next) {
  const { status } = req.body.data;
  if (["booked", "seated", "finished", "cancelled"].includes(status)) {
    return next();
  }
  next({
    status: 400,
    message: `unknown`,
  });
}

async function updateStatus(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

function isReservationStatusBooked(req, res, next) {
  if (res.locals.reservation.status === "booked") {
    return next();
  }
  next({
    status: 400,
    message: `Only reservations with a status of "booked" may be edited.`,
  });
}

async function update(req, res) {
  const updatedReservation = { ...req.body.data };
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
    peoplePropIsANumber,
    hasNumOfPeople,
    hasStatusProp,
    isStatusSeated,
    isStatusFinished,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    //isReservationStatusBooked,
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
    peoplePropIsANumber,
    hasNumOfPeople,
    asyncErrorBoundary(update),
  ],
};
