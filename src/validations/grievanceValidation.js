import Joi from "joi";

export const createGrievanceSchema = Joi.object({
  subject: Joi.string().trim().min(5).max(150).required(),

  description: Joi.string().trim().min(10).max(5000).required(),

  category: Joi.string()
    .valid(
      "ACADEMIC",
      "ADMINISTRATION",
      "FACILITY",
      "EXAMINATION",
      "OTHER",
    )
    .required(),
});

export const updateGrievanceStatusSchema = Joi.object({
  status: Joi.string()
    .valid("OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED")
    .required(),
});

export const assignGrievanceSchema = Joi.object({
  assigned_staff_id: Joi.number().integer().positive().required(),
});

export const updateGrievancePrioritySchema = Joi.object({
  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH")
    .required(),
});