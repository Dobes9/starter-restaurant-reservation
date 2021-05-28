/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const dateIsTuesday = require("../errors/dateIsTuesday");
const beforeClosing = require("../errors/beforeClosing");

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

// function hasData(req, res, next) {
//   if (req.body.data) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `Body must have a data property`,
//   });
// }

// function hasFirstName(req, res, next) {
//   const { first_name } = req.body.data;
//   if (first_name) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `first_name`,
//   });
// }

// function hasLastName(req, res, next) {
//   const { last_name } = req.body.data;
//   if (last_name) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `last_name`,
//   });
// }

// function hasMobileNumber(req, res, next) {
//   const { mobile_number } = req.body.data;
//   if (mobile_number) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `mobile_number`,
//   });
// }

// function hasReservationDate(req, res, next) {
//   const { reservation_date } = req.body.data;
//   if (reservation_date) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `reservation_date`,
//   });
// }

// function reservationNotOnTuesdays(req, res, next) {
//   const reservationDate = new Date(req.body.data.reservation_date);
//   if (reservationDate.getUTCDay() === 2) {
//     next({
//       status: 400,
//       message: `closed`,
//     });
//   }
//   return next();
// }

// function reservationForAFutureDate(req, res, next) {
//   const reservationDate = new Date(
//     `${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`
//   );
//   const todaysDate = new Date();
//   if (reservationDate < todaysDate) {
//     next({
//       status: 400,
//       message: `future`,
//     });
//   }
//   return next();
// }

// function hasReservationTime(req, res, next) {
//   const { reservation_time } = req.body.data;
//   if (reservation_time) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `reservation_time`,
//   });
// }

// function isProperDate(req, res, next) {
//   if (req.body.data.reservation_date.length === 10) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `reservation_date`,
//   });
// }

// function isProperTime(req, res, next) {
//   const reservationTime = new Date(
//     `${req.body.data.reservation_date}T${req.body.data.reservation_time}`
//   );
//   if (typeof reservationTime.getHours() === "function") {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `reservation_time`,
//   });
// }

// function reservationTimeAfterOpen(req, res, next) {
//   const reservationTime = new Date(req.body.data.reservation_time);
//   if (
//     reservationTime.getHours() < 10 ||
//     (reservationTime.getHours() === 10 && reservationTime.getMinutes() < 30)
//   ) {
//     next({
//       status: 400,
//       message: `reservation_time`,
//     });
//   }
//   return next();
// }

// function reservationTimeOneHourBeforeClose(req, res, next) {
//   const reservationTime = new Date(req.body.data.reservation_time);
//   if (
//     reservationTime.getUTCHours() > 21 ||
//     (reservationTime.getUTCHours() === 21 &&
//       reservationTime.getUTCMinutes() > 30)
//   ) {
//     next({
//       status: 400,
//       message: `reservation_time`,
//     });
//   }
//   return next();
// }

// function peoplePropIsANumber(req, res, next) {
//   const { people } = req.body.data;
//   if (typeof people === "number") {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `people`,
//   });
// }

// function hasNumOfPeople(req, res, next) {
//   const { people } = req.body.data;
//   if (people >= 1) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `people`,
//   });
// }

// function hasStatusProp(req, res, next) {
//   const { status } = req.body.data;
//   if (status) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `status`,
//   });
// }

// function isStatusSeated(req, res, next) {
//   const { status } = req.body.data;
//   if (status === "seated") {
//     next({
//       status: 400,
//       message: `seated`,
//     });
//   }
//   return next();
// }

// function isStatusFinished(req, res, next) {
//   const { status } = req.body.data;
//   if (status === "finished") {
//     next({
//       status: 400,
//       message: `finished`,
//     });
//   }
//   return next();
// }

const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid Field(s): ${invalidFields.join(", ")} `,
    });
  return next();
}

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

const isValid = (req, res, next) => {
  const {
    data: { reservation_date, reservation_time, people, status },
  } = req.body;
  const date = new Date(reservation_date);
  const currentDate = new Date();
  if (typeof people === "string" && people > 0) {
    return next({
      status: 400,
      message: `people: ${people} is not a valid number!`,
    });
  }

  if (reservation_date.match(/[a-z]/i)) {
    return next({
      status: 400,
      message: ` reservation_date: ${reservation_date} is not a date!`,
    });
  }

  if (reservation_time.match(/[a-z]/i)) {
    return next({
      status: 400,
      message: ` reservation_time: ${reservation_time} is not a valid time!`,
    });
  }
  if (
    date.valueOf() < currentDate.valueOf() &&
    date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16)
  )
    return next({
      status: 400,
      message: "Reservations must be made in the future!",
    });

  if (dateIsTuesday(reservation_date)) {
    return next({
      status: 400,
      message: `Sorry closed on Tuesday!`,
    });
  }
  if (beforeClosing(reservation_time)) {
    return next({
      status: 400,
      message: `Sorry We are not open during this time`,
    });
  }
  if (status === "seated" || status === "finished") {
    return next({
      status: 400,
      message: "reservation has already been seated or is already finished",
    });
  }
  next();
};

async function create(req, res) {
  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation[0],
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

// function validStatus(req, res, next) {
//   const { status } = req.body.data;
//   if (["booked", "seated", "finished", "cancelled"].includes(status)) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `unknown`,
//   });
// }

async function update(req, res) {
  const updatedReservation = { ...req.body.data };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

const validStatusUpdate = (req, res, next) => {
  const {
    data: { status },
  } = req.body;
  const { reservation } = res.locals;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }

  if (status === "cancelled") {
    return next();
  }

  if (status !== "booked" && status !== "seated" && status !== "finished")
    return next({ status: 400, message: "Can not update unknown status" });

  next();
};

async function updateStatus(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

// function isReservationStatusFinished(req, res, next) {
//   if (res.locals.reservation.status === "finished") {
//     next({
//       status: 400,
//       message: `finished`,
//     });
//   }
//   return next();
// }

module.exports = {
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    isValid,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    isValid,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatusUpdate,
    asyncErrorBoundary(updateStatus),
  ],
};

// // teddy check below ------>
// const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const service = require("./reservations.service");
// const hasProperties = require("../errors/hasProperties");
// const dateIsTuesday = require("../errors/dateIsTuesday");
// const beforeClosing = require("../errors/beforeClosing");

// /**
//  * List handler for reservation resources
//  */
// const VALID_PROPERTIES = [
//   "reservation_id",
//   "first_name",
//   "last_name",
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people",
//   "status",
//   "created_at",
//   "updated_at",
// ];

// function hasOnlyValidProperties(req, res, next) {
//   const { data = {} } = req.body;

//   const invalidFields = Object.keys(data).filter(
//     (field) => !VALID_PROPERTIES.includes(field)
//   );

//   if (invalidFields.length)
//     return next({
//       status: 400,
//       message: `Invalid Field(s): ${invalidFields.join(", ")} `,
//     });
//   next();
// }

// const hasRequiredProperties = hasProperties(
//   "first_name",
//   "last_name",
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people"
// );

// const isValid = (req, res, next) => {
//   const {
//     data: { reservation_date, reservation_time, people, status },
//   } = req.body;
//   const date = new Date(reservation_date);
//   const currentDate = new Date();
//   if (typeof people === "string" && people > 0) {
//     return next({
//       status: 400,
//       message: `people: ${people} is not a valid number!`,
//     });
//   }

//   if (reservation_date.match(/[a-z]/i)) {
//     return next({
//       status: 400,
//       message: ` reservation_date: ${reservation_date} is not a date!`,
//     });
//   }

//   if (reservation_time.match(/[a-z]/i)) {
//     return next({
//       status: 400,
//       message: ` reservation_time: ${reservation_time} is not a valid time!`,
//     });
//   }
//   if (
//     date.valueOf() < currentDate.valueOf() &&
//     date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16)
//   )
//     return next({
//       status: 400,
//       message: "Reservations must be made in the future!",
//     });

//   if (dateIsTuesday(reservation_date)) {
//     return next({
//       status: 400,
//       message: `Sorry closed on Tuesday!`,
//     });
//   }
//   if (beforeClosing(reservation_time)) {
//     return next({
//       status: 400,
//       message: `Sorry We are not open during this time`,
//     });
//   }
//   if (status === "seated" || status === "finished") {
//     return next({
//       status: 400,
//       message: "reservation has already been seated or is already finished",
//     });
//   }
//   next();
// };

// async function reservationExists(req, res, next) {
//   const { reservationId } = req.params;
//   const error = {
//     status: 404,
//     message: `Reservation ${reservationId} cannot be found`,
//   };

//   if (!reservationId) return next(error);

//   const reservation = await service.read(reservationId);

//   if (!reservation) return next(error);
//   res.locals.reservation = reservation;
//   next();
// }

// const validStatusUpdate = (req, res, next) => {
//   const {
//     data: { status },
//   } = req.body;
//   const { reservation } = res.locals;
//   if (reservation.status === "finished") {
//     return next({
//       status: 400,
//       message: "a finished reservation cannot be updated",
//     });
//   }

//   if (status === "cancelled") {
//     return next();
//   }

//   if (status !== "booked" && status !== "seated" && status !== "finished")
//     return next({ status: 400, message: "Can not update unknown status" });

//   next();
// };

// async function list(req, res, next) {
//   const { date, mobile_number } = req.query;

//   if (mobile_number) {
//     const reservationByNum = await service.listByMobileNum(mobile_number);
//     res.status(200).json({ data: reservationByNum });
//   }
//   const reservation = await service.list(date);
//   res.status(200).json({ data: reservation });
// }

// async function create(req, res) {
//   const newReservation = await service.create(req.body.data);
//   res.status(201).json({ data: newReservation });
// }

// async function read(req, res) {
//   const { reservation } = res.locals;
//   res.json({ data: reservation });
// }

// async function update(req, res) {
//   const { reservationId } = req.params;

//   const data = await service.update(reservationId, req.body.data);

//   res.status(200).json({ data: data[0] });
// }

// async function updateStatus(req, res) {
//   const {
//     data: { status },
//   } = req.body;

//   const { reservationId } = req.params;
//   const updatedStatus = await service.updateStatus(reservationId, status);

//   res.status(200).json({ data: { status: updatedStatus[0] } });
// }

// module.exports = {
//   list: [asyncErrorBoundary(list)],
//   create: [
//     hasOnlyValidProperties,
//     hasRequiredProperties,
//     isValid,
//     asyncErrorBoundary(create),
//   ],
//   read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
//   update: [
//     asyncErrorBoundary(reservationExists),
//     hasOnlyValidProperties,
//     hasRequiredProperties,
//     isValid,
//     asyncErrorBoundary(update),
//   ],
//   updateStatus: [
//     asyncErrorBoundary(reservationExists),
//     asyncErrorBoundary(validStatusUpdate),
//     asyncErrorBoundary(updateStatus),
//   ],
// };
