# Student Portal API

A Node.js + Express backend built for a student management portal with role-based authentication, password recovery workflows, and admin/student operations.

The project is designed around MySQL, Sequelize, Redis, JWT, and Google OAuth for secure and modular access control.

## Features

- Admin, staff, and student login using a single `identifier` field
- JWT access tokens with refresh-token cookie rotation
- Redis-based JWT blacklist for logout invalidation
- Password change enforcement for first-time logins (`must_change_password`)
- Forgot password and reset password via email
- Student creation, listing, update, patch, and delete operations
- Student self-profile route
- Role-based authorization middleware
- Joi validation for request payloads and query filters
- Google OAuth login flow
- Redis-backed rate limiting and caching
- MySQL + Sequelize models and migrations
- Centralized error handling and response conventions

## Tech stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- Redis
- JWT
- bcrypt
- Joi
- Nodemailer
- Passport.js + Google OAuth 2.0
- dotenv
- nodemon

## Project structure

```text
student-portal/
├── src/
│   ├── config/
│   │   ├── passport.js
│   │   ├── redis.js
│   │   └── sequelize.js
│   ├── constants/
│   │   ├── messages.js
│   │   └── statusCodes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── googleAuthController.js
│   │   ├── studentController.js
│   │   └── studentProfileController.js
│   ├── middleware/
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── mustChangePassword.js
│   │   ├── ratelimiter.js
│   │   ├── validatetoken.js
│   │   ├── validate.js
│   │   └── verifyresettoken.js
│   ├── migrations/
│   ├── models/
│   │   ├── admin.js
│   │   ├── staff.js
│   │   └── student.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── googleAuthRoutes.js
│   │   └── studentRoutes.js
│   ├── seeders/
│   ├── services/
│   │   ├── accountService.js
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   └── studentprofileService.js
│   ├── utils/
│   │   ├── appError.js
│   │   ├── generateStudentId.js
│   │   ├── generatetoken.js
│   │   └── sendEmail.js
│   ├── validations/
│   │   ├── authJoi.js
│   │   └── studentValidation.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── .sequelizerc
├── package.json
├── package-lock.json
├── README.md
└── node_modules/
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- MySQL server running
- Redis server running
- A Gmail account or SMTP-based email provider for reset emails

## Installation

1. Clone the repository and go into the project folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root using the following format:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_portal
DB_PORT=3306

NODE_ENV=development
PORT=5000

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
RESET_TOKEN_SECRET=your_reset_token_secret

REDIS_URL=redis://localhost:6379

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RESET_PASSWORD_URL=http://localhost:5000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPassword123
```

4. Run the database migrations:

```bash
npm run db:migrate
```

5. Seed the initial admin user:

```bash
npm run db:seed
```

6. Start the API server:

```bash
npm run dev
```

The app runs on the port configured in `PORT` (default: `5000`).

## Authentication and authorization

This backend supports three primary roles:

- `admin`
- `staff`
- `student`

The login flow accepts a single `identifier` value that can be either:

- admin email
- staff ID
- student ID

Example login request:

```json
{
 "identifier": "STU2024001",
 "password": "yourPassword"
}
```

### JWT behavior

- Access token: short-lived and used for authenticated requests
- Refresh token: stored in an `HttpOnly` cookie
- Logout adds the access token JTI to Redis blacklist
- Token expiration is enforced through the verification middleware

## API endpoints

### Auth routes

#### POST /auth/login

Logs in a user and returns a JWT access token.

Request body:

```json
{
 "identifier": "admin@example.com",
 "password": "StrongPassword123"
}
```

Response:

```json
{
 "msg": "Login successful",
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 "mustChangePassword": false
}
```

#### POST /auth/forgotpassword

Request body:

```json
{
 "email": "student@example.com"
}
```

#### POST /auth/resetpassword/:token

Resets the password using a token sent by email.

Request body:

```json
{
 "password": "NewPassword123"
}
```

#### POST /auth/change-password

Requires authentication. Changes the current user password.

Request body:

```json
{
 "currentPassword": "OldPassword123",
 "newPassword": "NewPassword123"
}
```

#### POST /auth/refresh-token

Refreshes the short-lived access token from the refresh-token cookie.

#### POST /auth/logout

Logs out the current user and clears the refresh-token cookie.

#### GET /auth/google

Starts Google OAuth login.

#### GET /auth/google/callback

Google OAuth callback route.

### Student routes

All student routes are mounted under `/admin/students` and require the authenticated user to have the correct role.

#### GET /admin/students/me

Returns the logged-in student profile. Allowed only for students.

#### POST /admin/students/new

Creates a new student record. Allowed for admins.

Request body:

```json
{
 "name": "Sanjay Kumar",
 "email": "sanjay@example.com",
 "date_of_birth": "2004-06-01",
 "admission_year": 2024,
 "department": "CSE"
}
```

#### GET /admin/students/all

Lists students with optional filters and pagination.

Query parameters:

- `id`
- `student_id`
- `name`
- `email`
- `admission_year`
- `department`
- `page`
- `limit`

#### PUT /admin/students/update/:id

Fully updates a student record.

#### PATCH /admin/students/patch/:id

Partially updates a student record.

#### DELETE /admin/students/delete/:id

Deletes a student record.

## Security notes

- Passwords are hashed using bcrypt.
- Redis stores token blacklist entries and request counters.
- Rate limiting is enforced to reduce brute-force abuse.
- Validation is centralized using Joi before the controller layer executes.
- Refresh tokens are set as `HttpOnly` cookies to minimize browser-side exposure.

## Database and migrations

The project includes Sequelize migration files and a seed file for the initial admin account.

Useful commands:

```bash
npm run db:migrate
npm run db:migrate:status
npm run db:migrate:undo
npm run db:seed
```

## Notes

- Student IDs are generated automatically using admission year and department information.
- Newly created student accounts are created with `must_change_password = true` by default.
- The application expects MySQL and Redis services to be running before startup.

## License

ISC

