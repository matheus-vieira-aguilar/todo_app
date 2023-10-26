import Joi from "joi";

export const taskSchema = Joi.object({
  title: Joi.string().required().max(200),
  description: Joi.string().required().max(500),
  done: Joi.boolean().optional().default(false),
});
