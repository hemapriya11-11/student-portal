import Joi from "joi";

export const signupSchema = Joi.object({
    user_name: Joi.string().trim().required(),

    email: Joi.string().email().lowercase().trim().required(),

    password: Joi.string().min(8).required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required(),

    password: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required()
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().min(8).required()
});