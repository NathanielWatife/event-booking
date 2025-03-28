# Event Ticket Booking System
    This is a Node.js application for managing event ticket bookings. It provides RESTful APIs to initialize events, book tickets, cancel bookings, and check event status.

## Table of Contents
## Features
- Technologies Used
- Setup and Installation
- API Documentation
- Design Choices
- Testing
- Error Handling
- Performance and Scalability



# Features
- Initialize an event with a set number of tickets.
- Book tickets concurrently.
- Add users to a waiting list when tickets are sold out.
- Cancel bookings and automatically assign tickets to waiting list users.
- View available tickets and waiting list status.
- Store order details in an SQLite database.

## Technologies Used
- Backend: Node.js, Express.js
- Database: SQLite
- Testing: Jest, Supertest
- Tools: Postman (for API testing)

## Setup and Installation
- Prerequisites
- Node.js (v16 or higher)
- npm (Node Package Manager)
Steps
Clone the repository:
```
git clone https://github.com/NathanielWatife/event-bookinggit
```

Navigate to the project directory:
cd event-ticket-booking
Install dependencies:
```
npm install
```

Start the server:
```
node src/app.js
The server will run on http://localhost:3000.
```


# API Documentation
1. Initialize Event
Endpoint: POST /api/initialize

Description: Initialize a new event with a given number of tickets.
Request Body:
```
{
  "eventId": 1,
  "totalTickets": 100
}
```
Response:
```
{
  "message": "Event initialized"
}
```


2. Book Ticket
Endpoint: POST /api/book

Description: Book a ticket for a user. If tickets are sold out, add the user to the waiting list.

Request Body:
```
{
  "eventId": 1,
  "userId": "user1"
}
```


Response (if tickets are available):
```
{
  "status": "booked",
  "userId": "user1"
}
```

Response (if tickets are sold out):
```
{
  "status": "waiting",
  "userId": "user1"
}
```

3. Cancel Ticket
Endpoint: POST /api/cancel

Description: Cancel a booking for a user. If there’s a waiting list, assign the ticket to the next user.

Request Body:
```
{
  "eventId": 1,
  "userId": "user1"
}
```

Response (if cancellation is successful):
```
{
  "status": "cancelled",
  "userId": "user1"
}
```
Response (if ticket is reassigned):
```
{
  "status": "reassigned",
  "userId": "user2"
}
```


4. Get Event Status
Endpoint: GET /api/status/:eventId

Description: Retrieve the current status of an event (available tickets, waiting list count).

Response:
```
{
  "availableTickets": 99,
  "waitingListCount": 0
}
```


Design Choices
In-Memory Storage: Used a Map to store event data for fast access and concurrency handling.
Concurrency Handling: Used asynchronous programming and atomic operations to avoid race conditions.
Modular Code: Separated concerns into controllers, services, and models for better maintainability.
Error Handling: Implemented comprehensive error handling for edge cases (e.g., invalid event ID, sold-out tickets).
Testing: Used Jest and Supertest for unit and integration testing.
Testing
Unit Tests: Tested individual methods in eventService.js.
Integration Tests: Tested API endpoints using Supertest.
Test Coverage: Achieved 80%+ test coverage.

Run Tests
```
npm test
```
Error Handling
Invalid Event ID: Returns 404 Not Found with a message: Event not found.

```
Sold-Out Tickets: Returns 200 OK with a message: {"status": "waiting", "userId": "user1"}.
```


Invalid Request Body: Returns 400 Bad Request with a message: Invalid input.

Performance and Scalability
In-Memory Storage: Provides fast access but is not persistent. 
Concurrency Handling: Ensures thread-safety for booking and cancellation operations.

Scalability: The system can be scaled horizontally by deploying multiple instances behind a load balancer.


GitHub Repository
https://github.com/NathanielWatife