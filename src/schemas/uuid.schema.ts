import Joi from "joi";

export const uuid = Joi.object({ id: Joi.string().uuid().required() });
