import Joi from "joi";

export const createAnnouncementSchema = Joi.object({
  title: Joi.string().trim().required(),

  content: Joi.string().trim().required(),

  audience: Joi.string()
    .valid("ALL", "STUDENTS", "STAFF")
    .default("ALL"),
});

export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().trim().required(),

  content: Joi.string().trim().required(),

  audience: Joi.string()
    .valid("ALL", "STUDENTS", "STAFF")
    .required(),
});

export const patchAnnouncementSchema = Joi.object({
  title: Joi.string().trim(),

  content: Joi.string().trim(),

  audience: Joi.string().valid("ALL", "STUDENTS", "STAFF"),
}).min(1);