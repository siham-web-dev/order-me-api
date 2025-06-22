import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
  fullName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 50 characters",
    "any.required": "Full name is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Phone number must be between 10-15 digits",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 50 characters",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Phone number must be between 10-15 digits",
    }),
  avatarUrl: Joi.string().uri().messages({
    "string.uri": "Avatar must be a valid URL",
  }),
});
