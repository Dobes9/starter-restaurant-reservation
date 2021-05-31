# Capstone: Restaurant Reservation System Backend
#### Final Capstone for Thinkful Engineering Immersion Program

// some text to explain what this capstone tests our ability to do

## Definitions of API Routes

### GET /reservations
For this route, the controller additionally expects to receive either a date or mobile_number query. If it receives a date query, it will respond with all reservations on the date query, but only reservations with a status of "booked" or "seated". "finished" or "cancelled" reservations will not be returned. If a mobile_number query is passed in, the controller will return all reservations that match the phone number provided, regardless of their status.

### POST /reservations
This route will create a new reservation, assuming the reservation passes all validations. The reservation needs all required fields shown in hasProperties, and the reservation must be set for a non Tuesday, between the hours of 10:30 and 21:30.

### GET /reservations/:reservation_id
This route returns the information for a single reservation, based on its ID. Is used in the frontend when seating or editing a reservation.

### PUT /reservations/:reservation_id
This route updates a reservation, as long as the updated information also passes the same validations as creating a new reservation

### PUT /reservations/:reservation_id/status
This route also updates a reservation, but is set up to only update the "status" property of a reservation. If a reservation's status is "finished", the status cannot be updated. If the request body status property is not "booked", "seated", "finished", or "cancelled", the status will not be updated. This route is currently only being called by the front end to set a reservation's status to "cancelled".

### GET /tables
This route will list all tables in the database.

### POST /tables
This route will create a new table in the database, as long as the table has the properties listed in hasProperties, and the table_name is at least 2 characters long, and the capacity is at least 1.

### GET /tables/:table_id
This route will read the information for a single table, based on its ID.

### PUT /tables/:table_id/seat
This route will update the reservation_id property of a table, which by default, is set to null. If the reservation's status is set to "booked", and if the table's "capacity" is greater than or equal to the reservation's "people" property, then the reservation_id foreign key property will be set to the reservation_id property of the reservation. This will indicate that the table is now occupied in the frontend. Additionally, the update function from the service for the reservations route will be called, in order to update the reservation's status to "seated".

### DELETE /tables/:table_id/seat
This route being a DELETE method is a bit misleading. Neither the table nor the reservation will be deleted from the database from this method. If the table is occupied (it will be considered occupied if it's reservation_id property is not null), then this method will set the table's reservation_id property to null, and the update function from the service for the reservations route will be called to set the reservation's status property to "finished".

## Technology
#### Built with:
  * Node.js, Express, PostgreSQL, Knex, CORS.
