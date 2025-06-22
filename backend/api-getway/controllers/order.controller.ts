import { Request, Response } from "express";
import { OrderClient } from "../clients/order.client";
import { ValidationError } from "../errors/validation.errors";
import { NotFoundError } from "../errors/not-found.errors";
import { createOrderSchema } from "../validators/order.validator";
import { AuthRequest } from "../types/request.types";

export class OrderController {
  public static async createOrder(req: Request, res: Response) {
    try {
      const { error, value } = createOrderSchema.validate(req.body);
      if (error) {
        throw new ValidationError("Validation Error", error.details);
      }

      const newOrder = await OrderClient.createOrder(value);
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message, details: error.details });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public static async getOrderById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const order = await OrderClient.getOrderById(id);
      if (!order) {
        throw new NotFoundError("Order not found");
      }
      res.json(order);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public static async listOrders(req: AuthRequest, res: Response) {
    const { userId } = req.user; // Assuming userId is set in the request by the auth middleware
    try {
      const orders = await OrderClient.listOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
