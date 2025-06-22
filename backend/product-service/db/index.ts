import { DataSource } from "typeorm";
import { Product } from "./entities/product.entity";
import { Size } from "./entities/size.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Product, Size],
  synchronize: true, // Auto-create tables based on entities
  poolSize: 10,
});

export async function connectToDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

export async function closeDatabaseConnection() {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("Database connection closed");
  }
}
