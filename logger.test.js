import logger from "./src/utils/logger.js";

logger.info(
  {
    studentId: 123,
    createdBy: 42
  },
  "Student created"
);

logger.warn(
  {
    userId: 42,
    attempts: 5
  },
  "Multiple failed login attempts"
);

const error = new Error("Database connection failed");

logger.error(
  {
    err: error,
    userId: 42
  },
  "Failed to create student"
);