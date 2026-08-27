# Student Portal Backend

A RESTful backend API for a Student Portal built using Node.js, Express.js, MySQL, and Sequelize ORM.

The project provides authentication, role-based access control, student management, validation, and password reset functionality.

##  Features

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Forgot password and reset password functionality
- Password reset emails via Nodemailer (`sendEmail.js`)
- Role-Based Access Control (RBAC)
- Admin, Staff/Teacher, and Student roles
- Student CRUD operations
- Student self-profile access
- Pagination and filtering
- Joi request validation
- Sequelize ORM with MySQL
- Redis caching support
- Centralized error handling with custom error class
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
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   ├── user.js
│   │   └── student.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
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
```

## Error Handling

The application uses a centralized error handling system with:

- **AppError**: Custom error class in `src/utils/appError.js` for creating operational errors with status codes
- **errorHandler**: Middleware in `src/middleware/errorHandler.js` for catching and formatting errors

## Redis Configuration

Redis is configured in `src/config/redis.js` for caching purposes. Ensure Redis is running and the `REDIS_URL` environment variable is set correctly.

