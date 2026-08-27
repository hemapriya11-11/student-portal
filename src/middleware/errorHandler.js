import { STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode =
    err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;

  const message = err.isOperational
    ? err.message
    : MESSAGES.SOMETHING_WENT_WRONG;

  return res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
  });
};