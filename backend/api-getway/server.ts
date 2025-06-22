import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.router";
import orderRoutes from "./routes/order.router";
import productRoutes from "./routes/product.router";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { ErrorRequestHandler } from "express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
// Versioned API routes
const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/orders", orderRoutes);
apiRouter.use("/products", productRoutes);

// Mount the versioned API router
app.use("/api/v1", apiRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
