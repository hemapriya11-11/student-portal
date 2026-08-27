import { MESSAGES } from "../constants/messages.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { AppError } from "../utils/appError.js";

export const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.map(
        (detail) => detail.message
      );

      return next(
        new AppError(
          MESSAGES.VALIDATION_FAILED,
          STATUS_CODES.BAD_REQUEST,
          validationErrors
        )
      );
    }

    next();
  };
};