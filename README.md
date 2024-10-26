### `app.js`

The main entry point of the application. It initializes the Express app, connects to the database, sets up routes, and starts the server.

### `config/`

Contains configuration files.

- `config.js`: Database connection and other configuration settings.

### `controllers/`

Contains controller files that handle the logic for different routes.

- `authController.js`: Handles user authentication.
- `userController.js`: Manages user data and interactions.

### `middleware/`

Contains middleware functions that process requests before they reach the controllers.

- `aiUsageMiddleware.js`: Checks AI usage limits.
- `authMiddleware.js`: Protects routes by requiring authentication.
- `uploadMiddleware.js`: Handles file uploads using Multer.

### `models/`

Contains Mongoose models for MongoDB collections.

- `Data.js`: Schema for user data.
- `User.js`: Schema for user information.

### `routes/`

Contains route definitions.

- `authRoutes.js`: Routes for authentication.
- `paymentRoutes.js`: Routes for payment processing.
- `userRoutes.js`: Routes for user-related operations.

### `services/`

Contains service files for external integrations.

- `oauthService.js`: Handles OAuth authentication.
- `stripeService.js`: Manages Stripe payment processing.

### `uploads/`

Directory for storing uploaded files.

### `utils/`

Contains utility functions.

- `errorHandler.js`: Custom error handler middleware.
- `hashUtil.js`: Utility for hashing passwords.

## Routes

### Authentication Routes

- `POST /api/auth/login`: User login.
- `POST /api/auth/register`: User registration.

### User Routes

- `POST /api/user/`: Create new data.
- `GET /api/user/`: Get user data.
- `PUT /api/user/:id`: Update data by ID.
- `DELETE /api/user/:id`: Delete data by ID.
- `POST /api/user/use-ai`: Use AI service.
- `PUT /api/user/update-plan`: Update user plan.
- `POST /api/user/upload`: Upload a file.

### Payment Routes

- `POST /api/payment/charge`: Process a payment.

## Middleware

- `authMiddleware.js`: Protects routes by requiring authentication.
- `aiUsageMiddleware.js`: Checks AI usage limits.
- `uploadMiddleware.js`: Handles file uploads using Multer.

## Controllers

- `authController.js`: Handles user authentication.
- `userController.js`: Manages user data and interactions.

## Models

- `Data.js`: Schema for user data.
- `User.js`: Schema for user information.

## Services

- `oauthService.js`: Handles OAuth authentication.
- `stripeService.js`: Manages Stripe payment processing.

## Utilities

- `errorHandler.js`: Custom error handler middleware.
- `hashUtil.js`: Utility for hashing passwords.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
