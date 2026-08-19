import Joi from "joi";


export const createStudentSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  personal_email: Joi.string().email().required(),

  age: Joi.number().integer().min(1).max(100).required(),

  department: Joi.string().min(2).max(50).required()
});


export const studentIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});


export const updateStudentSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  personal_email: Joi.string().email().required(),

  age: Joi.number().integer().min(1).max(100).required(),

  department: Joi.string().min(2).max(50).required()
});


export const patchStudentSchema = Joi.object({
  name: Joi.string().min(2).max(50),

  personal_email: Joi.string().email(),

  age: Joi.number().integer().min(1).max(100),

  department: Joi.string().min(2).max(50)
}).min(1);


export const paginationSchema = Joi.object({
  id: Joi.number().integer().positive(),

  name: Joi.string().min(2).max(50),

  age: Joi.number().integer().min(1).max(100),

  department: Joi.string().min(2).max(50),

  personal_email: Joi.string().email(),

  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10)
});