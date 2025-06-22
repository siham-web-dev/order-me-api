import { Request, Response } from "express";
import { IdentityClient } from "../clients/identity.client";
import { ValidationError } from "../errors/validation.errors";
import { registerSchema, loginSchema } from "../validators/user.validators";

export class UserController {
  public static async register(req: Request, res: Response) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        throw new ValidationError("Validation Error", error.details);
      }

      const newUser = await IdentityClient.register(value);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message, details: error.details });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        throw new ValidationError("Validation Error", error.details);
      }

      const token = await IdentityClient.login(value.email, value.password);
      res.json({ token });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message, details: error.details });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
