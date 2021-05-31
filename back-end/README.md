# Capstone: Restaurant Reservation System Backend
#### Final Capstone for Thinkful Engineering Immersion Program

// some text to explain what this capstone tests our ability to do

## Definitions of API Routes

### GET /reservations
For this route, the controller additionally expects to receive either a date or mobile_number query. If it receives a date query, it will respond with all reservations on the date query, but only reservations with a status of "booked" or "seated". "finished" or "cancelled" reservations will not be returned. If a mobile_number query is passed in, the controller will return all reservations that match the phone number provided, regardless of their status.

### POST /reservations
This route will create a new reservation, assuming the reservation passes all validations. The reservation needs all required fields shown in VALID_PROPERTIES, and the reservation must be set for a non Tuesday, between the hours of 10:30 and 21:30.

### GET /reservations/:reservation_id
