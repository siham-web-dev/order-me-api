import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  basePrice: Joi.number().positive().required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
});
