import { MESSAGES } from "../constants/messages.js";

import { STATUS_CODES } from "../constants/statusCodes.js";

export const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
    });

    if (error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: MESSAGES.VALIDATION_FAILED,
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};
