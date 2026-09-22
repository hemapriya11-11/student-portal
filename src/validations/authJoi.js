import Joi from "joi";

export const loginSchema = Joi.object({
  identifier: Joi.string().trim().required(),
  password: Joi.string().min(6).required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});
export const changePasswordSchema = Joi.object({
currentPassword: Joi.string().required(),
newPassword: Joi.string().min(8).required(),
});