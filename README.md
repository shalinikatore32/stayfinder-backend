# stayfinder-backend

This repository contains the backend server for StayFinder, a platform designed to help users find and book accommodations. It provides RESTful APIs for user authentication, managing listings, handling bookings, and processing payments.

## Features

*   **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
*   **Listing Management:**
    *   Retrieve all listings.
    *   Retrieve a single listing by its ID.
    *   Search and filter listings based on location, availability dates, number of guests, and price.
*   **Booking System:**
    *   Allow users to book listings.
    *   Retrieve bookings for a logged-in user.
    *   Fetch details of a specific booking.
*   **Payment Integration:** Integration with Stripe for processing payments for bookings.
*   **User Profiles:** Allow authenticated users to view their profile information.
*   **Data Seeding:** Script to populate the database with initial listing data.

## Technologies Used

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js.
*   **MongoDB:** NoSQL database for storing application data.
*   **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **JSON Web Tokens (JWT):** For securing API endpoints and managing user sessions.
*   **bcryptjs:** Library for hashing passwords.
*   **Stripe:** Payment processing platform.
*   **dotenv:** Module to load environment variables from a `.env` file.
*   **cors:** Middleware for enabling Cross-Origin Resource Sharing.

## Prerequisites

Before you begin, ensure you have the following installed:
*   Node.js (v14 or higher recommended)
*   npm (Node Package Manager)
*   MongoDB (running instance, local or cloud-hosted)

## Getting Started

Follow these steps to get the backend server up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/shalinikatore32/stayfinder-backend.git
cd stayfinder-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:3000 # Or your frontend URL
```

Replace `your_mongodb_connection_string`, `your_jwt_secret_key`, `your_stripe_secret_key` with your actual MongoDB connection string, a secure JWT secret, and your Stripe secret key respectively. Update `CLIENT_URL` to point to your frontend application's URL, which is used for redirection after payment.

### 4. Database Seeding (Optional)

The project includes a seeder script to populate the database with initial listing data.

**Important:** The seeder script (`seeder.js`) assumes at least one user already exists in the database to assign as the host for the listings. You may need to register a user first via the API, or modify the seeder script.

To run the seeder:
```bash
node seeder.js
```
This will delete all existing listings and insert the sample listings defined in `seeder.js`.

### 5. Running the Server

Once the dependencies are installed and environment variables are configured, you can start the server:

```bash
node index.js
```

The server will start, typically on `http://localhost:5000` (or the port specified in your `.env` file). You should see "Connected to MongoDB" and "Server is running on port [PORT]" messages in the console.

## API Endpoints

The server exposes the following API endpoints:

### Authentication (`/api/auth`)

*   `POST /register`: Register a new user.
    *   Request Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
*   `POST /login`: Log in an existing user.
    *   Request Body: `{ "email": "john@example.com", "password": "password123" }`
    *   Response: `{ "user": { ... }, "token": "jwt_token" }`

### Listings (`/api/listings`)

*   `GET /`: Get all listings.
*   `GET /search`: Search for listings based on query parameters.
    *   Query Parameters: `location` (string), `checkIn` (date string, e.g., YYYY-MM-DD), `checkOut` (date string), `guests` (number), `price` (number, max price per night).
    *   Example: `/api/listings/search?location=New York&guests=2`
*   `GET /:id`: Get a single listing by its ID.

### Bookings (`/api/bookings`)

*   `GET /user`: Get all bookings for the currently authenticated user. (Requires authentication)
*   `POST /create-checkout-session`: Create a Stripe checkout session for booking a listing.
    *   Request Body: `{ "listingId": "listing_id", "userId": "user_id", "checkInDate": "YYYY-MM-DD", "checkOutDate": "YYYY-MM-DD", "guests": 2 }`
    *   Response: `{ "url": "stripe_checkout_session_url" }`
*   `GET /:id`: Get details of a specific booking by ID.

### Users (`/api/users`)

*   `GET /profile`: Get the profile of the currently authenticated user. (Requires authentication)

## Project Structure

```
stayfinder-backend/
├── controllers/        # Handles request logic
│   ├── bookingController.js
│   ├── listingController.js
│   └── userController.js
├── middleware/         # Custom middleware (e.g., authentication)
│   └── auth.js
├── models/             # Mongoose data models/schemas
│   ├── Booking.js
│   ├── Listing.js
│   └── User.js
├── routes/             # Defines API routes
│   ├── auth.routes.js
│   ├── booking.routes.js
│   ├── listing.routes.js
│   ├── payment.js      # (Currently empty)
│   └── user.routes.js
├── index.js            # Main application entry point
├── package.json        # Project metadata and dependencies
├── seeder.js           # Script to seed database with initial data
└── .env                # (To be created by user) Environment variables
```

### `controllers/`
Contains the logic for handling incoming requests, interacting with models, and sending responses.

### `middleware/`
Houses custom middleware functions. `auth.js` includes `isAuthenticated` middleware to protect routes by verifying JWT tokens.

### `models/`
Defines Mongoose schemas for the application's data structures:
*   **User.js:** Schema for user accounts, including name, email, password (hashed), and host status. Includes methods for password hashing and comparison.
*   **Listing.js:** Schema for property listings, including title, location, price, amenities, availability, description, image, and host.
*   **Booking.js:** Schema for bookings, linking users to listings, and storing check-in/out dates, guests, total price, and status.

### `routes/`
Defines the API endpoints using Express Router. Each file corresponds to a resource or a functional area (e.g., authentication, listings).

## Authentication Flow

1.  **Registration:** A new user registers via `POST /api/auth/register`. Their password is.
2.  **Login:** An existing user logs in via `POST /api/auth/login` with their email and password.
3.  **Token Generation:** Upon successful login, the server generates a JWT containing the user's ID and signs it using `JWT_SECRET`.
4.  **Token Sent to Client:** The JWT is sent back to the client in the response.
5.  **Authenticated Requests:** For subsequent requests to protected routes, the client must include the JWT in the `Authorization` header as a Bearer token (e.g., `Authorization: Bearer <token>`).
6.  **Token Verification:** The `isAuthenticated` middleware on the server verifies the token. If valid, it extracts the user's ID, fetches the user's details (excluding the password) from the database, and attaches it to the `req.user` object. If the token is invalid or missing, a `401 Unauthorized` error is returned.
