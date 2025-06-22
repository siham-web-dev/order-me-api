import express from "express";
import { ProductController } from "../controllers/product.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", isAuthenticated, ProductController.createProduct);
router.put("/:id", isAuthenticated, ProductController.updateProduct);
router.delete("/:id", isAuthenticated, ProductController.deleteProduct);
router.get("/:id/sizes", ProductController.getProductSizes);

export default router;
