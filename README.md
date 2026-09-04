# Student Portal Backend

A RESTful backend API for a Student Portal built using Node.js, Express.js, MySQL, and Sequelize ORM.

The project provides authentication, role-based access control, student management, validation, and password reset functionality.

##  Features

- User registration and login
- JWT-based authentication with JTI (JWT ID) token invalidation
- Logout functionality using Redis token blacklist
- Password hashing using bcrypt
- Forgot password and reset password functionality
- Password reset emails via Nodemailer (`sendEmail.js`)
- Access token refresh mechanism
- Role-Based Access Control (RBAC)
- Admin, Staff/Teacher, and Student roles
- Student CRUD operations
- Student self-profile access
- Pagination and filtering
- Joi request validation
- Sequelize ORM with MySQL
- Redis caching support
- Centralized error handling with custom error class
- Rate limiting middleware for API protection
- Service layer architecture for business logic separation
- Centralized HTTP status codes and response messages
- Environment variable configuration
- Nodemon for development

##  Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Backend framework |
| MySQL | Database |
| Sequelize | ORM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Nodemailer | Sending password reset emails |
| Redis | Caching and session management |
| Joi | Request validation |
| dotenv | Environment variables |
| Nodemon | Development server |

##  Project Structure

```text
student-portal/
│
├── src/
│   │
│   ├── config/
│   │   ├── sequelize.js
│   │   └── redis.js
│   │
│   ├── constants/
│   │   ├── statusCodes.js
│   │   └── messages.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   └── studentProfileController.js
│   │
│   ├── middleware/
│   │   ├── authorize.js
│   │   ├── validatetoken.js
│   │   ├── verifyresettoken.js
│   │   ├── validate.js
│   │   ├── errorHandler.js
│   │   └── ratelimiter.js
│   │
│   ├── models/
│   │   ├── user.js
│   │   └── student.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   └── studentprofileService.js
│   │
│   ├── utils/
│   │   ├── generatetoken.js
│   │   ├── sendEmail.js
│   │   └── appError.js
│   │
│   ├── validations/
│   │   ├── authJoi.js
│   │   └── studentValidation.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Email Configuration

The forgot password flow sends a reset email using Nodemailer through `src/utils/sendEmail.js`.

Add the following values to your `.env` file:

```env
EMAIL_USER=your-gmail-address
EMAIL_PASS=your-app-password
RESET_PASSWORD_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
```

## JWT Authentication & Token Management

The application uses JWT (JSON Web Tokens) with the following features:

### Token Structure
- **Access Token**: Short-lived (15 minutes) token for API requests
- **Refresh Token**: Long-lived (7 days) token stored in HttpOnly cookie for token renewal
- **JTI (JWT ID)**: Unique identifier in each token for invalidation tracking

### Token Endpoints
- `POST /auth/login` - Returns accessToken and sets refreshToken cookie
- `POST /auth/refresh-token` - Generates new accessToken using refreshToken
- `POST /auth/logout` - Invalidates current accessToken by adding JTI to Redis blacklist

### Logout with JTI Blacklist
When a user logs out:
1. The JTI (unique token ID) is extracted from the JWT
2. JTI is stored in Redis blacklist with expiration equal to token's remaining lifetime
3. Any subsequent requests with blacklisted JTI are rejected
4. The refreshToken cookie is cleared

This ensures:
- Immediate token invalidation without database queries
- Automatic cleanup when token expires (Redis TTL)
- No manual token revocation needed after expiration


## Error Handling

The application uses a centralized error handling system with:

- **AppError**: Custom error class in `src/utils/appError.js` for creating operational errors with status codes
- **errorHandler**: Middleware in `src/middleware/errorHandler.js` for catching and formatting errors

## Rate Limiting

Rate limiting is implemented via `src/middleware/ratelimiter.js` to protect API endpoints from abuse:

- Limits requests to 5 per minute per IP address
- Uses Redis to track request counts
- Returns HTTP 429 (Too Many Requests) when limit is exceeded

## Service Layer Architecture

Business logic is separated into services for better maintainability:

- **authService.js**: Authentication-related operations (signup, login, password reset)
- **studentService.js**: Student data operations (CRUD operations with caching)
- **studentprofileService.js**: Student profile operations

Services use Redis caching to improve performance and reduce database queries.

## Redis Configuration

Redis is configured in `src/config/redis.js` for:
- Caching student data
- Rate limiting requests
- Session management

Ensure Redis is running and the `REDIS_URL` environment variable is set correctly.

