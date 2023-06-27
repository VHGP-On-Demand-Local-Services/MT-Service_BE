# MT-Service_BE

This is the README file for the MT-Service_BE project.

## Deployment

The project is currently deployed at: [https://home-service-vinhome.onrender.com](https://home-service-vinhome.onrender.com)

## API Endpoints

The following API endpoints are available in the project:

### Auth

- `POST /api/v1/auth/signup`: Creates a new user account. (Requires admin privileges)
- `POST /api/v1/auth/login`: Logs in a user.
- `POST /api/v1/auth/logout`: Logs out a user. (Requires authentication)

### User

- `GET /api/v1/users`: Retrieves all users. (Requires admin privileges)
- `GET /api/v1/users/:id`: Retrieves a specific user by ID. (Requires admin or user privileges)
- `GET /api/v1/users/search`: Searches for users. (Requires admin privileges)
- `PUT /api/v1/users/update-info/:id`: Updates user information. (Requires admin privileges)
- `PUT /api/v1/users/change-pass/:id`: Changes the password for a user. (Requires user authentication)
- `DELETE /api/v1/users/delete-user/:id`: Deletes a user account. (Requires admin privileges)

### Service

- `POST /api/v1/services/create-service`: Creates a new service. (Requires admin privileges)
- `GET /api/v1/services`: Retrieves all services. (Requires authentication)
- `GET /api/v1/services/:id`: Retrieves a specific service by ID. (Requires authentication)
- `PUT /api/v1/services/update/:id`: Updates a service. (Requires admin privileges)
- `DELETE /api/v1/services/delete/:id`: Deletes a service. (Requires admin privileges)

### Booking

- `POST /api/v1/booking/create-booking`: Creates a new booking. (Requires authentication)
- `GET /api/v1/booking`: Retrieves all bookings. (Requires admin privileges)
- `GET /api/v1/booking/:id`: Retrieves a specific booking by ID. (Requires admin or user privileges)
- `GET /api/v1/booking/userBooking/:userId`: Retrieves bookings for a specific user. (Requires admin or user privileges)
- `PUT /api/v1/booking/update/:id`: Updates the status of a booking. (Requires admin privileges)

Please refer to the source code for more details on authentication requirements and implementation.
