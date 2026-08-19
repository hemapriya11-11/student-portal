export const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message)
      });
    }

    next();
  };
};