import Joi from "joi";

export const createOrderSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.guid": "User ID must be a valid UUID",
    "any.required": "User ID is required",
  }),
  items: Joi.array()
    .min(1)
    .items(
      Joi.object({
        productId: Joi.string().uuid().required().messages({
          "string.guid": "Product ID must be a valid UUID",
          "any.required": "Product ID is required",
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
        price: Joi.number().positive().precision(2).required().messages({
          "number.base": "Price must be a number",
          "number.positive": "Price must be positive",
          "number.precision": "Price can have maximum 2 decimal places",
          "any.required": "Price is required",
        }),
      })
    )
    .required()
    .messages({
      "array.min": "Order must contain at least one item",
      "any.required": "Items are required",
    }),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required()
    .messages({
      "any.only":
        "Status must be one of pending, processing, shipped, delivered, or cancelled",
      "any.required": "Status is required",
    }),
});

export const orderIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "Order ID must be a valid UUID",
    "any.required": "Order ID is required",
  }),
});
