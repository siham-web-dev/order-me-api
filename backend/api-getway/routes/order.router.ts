import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", isAuthenticated, OrderController.createOrder);
router.get("/:id", isAuthenticated, OrderController.getOrderById);
router.get("/", isAuthenticated, OrderController.listOrders);

export default router;
