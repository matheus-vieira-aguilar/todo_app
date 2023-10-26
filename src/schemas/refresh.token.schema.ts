import Joi from "joi";

export const refreshTokenSchema = Joi.object({
  refreshId: Joi.string().required().uuid(),
  userId: Joi.string().required().uuid(),
});
