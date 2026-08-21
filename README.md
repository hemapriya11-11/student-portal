# Student Portal Backend

A RESTful backend API for a Student Portal built using Node.js, Express.js, MySQL, and Sequelize ORM.

The project provides authentication, role-based access control, student management, validation, and password reset functionality.

## 🚀 Features

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Forgot password and reset password functionality
- Role-Based Access Control (RBAC)
- Admin, Staff/Teacher, and Student roles
- Student CRUD operations
- Student self-profile access
- Pagination and filtering
- Joi request validation
- Sequelize ORM with MySQL
- Centralized HTTP status codes and response messages
- Environment variable configuration
- Nodemon for development

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Backend framework |
| MySQL | Database |
| Sequelize | ORM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Joi | Request validation |
| dotenv | Environment variables |
| Nodemon | Development server |

## 📁 Project Structure

```text
student-portal/
│
├── src/
│   │
│   ├── config/
│   │   └── sequelize.js
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
│   │   └── validate.js
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
│   │   └── generatetoken.js
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
└── package-lock.json
