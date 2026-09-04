import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { AppError } from "../utils/appError.js";

export const validate = (schema, property) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map(
        (detail) => detail.message,
      );

      return next(
        new AppError(
          MESSAGES.VALIDATION_FAILED,
          STATUS_CODES.BAD_REQUEST,
          validationErrors,
        ),
      );
    }

    // req.query cannot be reassigned in Express 5
    if (property === "query") {
      Object.assign(req.query, value);
    } else {
      req[property] = value;
    }

    next();
  };
};