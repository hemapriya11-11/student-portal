import Joi from "joi";

export const createStudentSchema = Joi.object({
name: Joi.string()
.trim()
.min(2)
.max(255)
.required(),

email: Joi.string()
.email()
.lowercase()
.trim()
.required(),

date_of_birth: Joi.date()
.max("now")
.required(),

admission_year: Joi.number()
.integer()
.min(2000)
.max(new Date().getFullYear())
.required(),

department: Joi.string()
.trim()
.min(2)
.max(50)
.required(),
});

export const getStudentQuerySchema = Joi.object({
id: Joi.number()
.integer()
.positive(),

student_id: Joi.string()
.trim(),

name: Joi.string()
.trim()
.min(2)
.max(255),

email: Joi.string()
.email()
.lowercase()
.trim(),

admission_year: Joi.number()
.integer()
.min(2000)
.max(new Date().getFullYear()),

department: Joi.string()
.trim()
.min(2)
.max(50),

page: Joi.number()
.integer()
.min(1)
.default(1),

limit: Joi.number()
.integer()
.min(1)
.max(100)
.default(10),
});


export const updateStudentSchema = Joi.object({
name: Joi.string()
.trim()
.min(2)
.max(255)
.required(),

email: Joi.string()
.email()
.lowercase()
.trim()
.required(),

date_of_birth: Joi.date()
.max("now")
.required(),

admission_year: Joi.number()
.integer()
.min(2000)
.max(new Date().getFullYear())
.required(),

department: Joi.string()
.trim()
.min(2)
.max(50)
.required(),
});

export const patchStudentSchema = Joi.object({
name: Joi.string()
.trim()
.min(2)
.max(255),

email: Joi.string()
.email()
.lowercase()
.trim(),

date_of_birth: Joi.date()
.max("now"),

admission_year: Joi.number()
.integer()
.min(2000)
.max(new Date().getFullYear()),

department: Joi.string()
.trim()
.min(2)
.max(50),
}).min(1);
