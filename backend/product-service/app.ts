import * as dotenv from "dotenv";
dotenv.config();

import { startGrpcServer } from "./grpc/server";
import { AppDataSource } from "./db";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    await startGrpcServer();
  } catch (error) {
    console.error("Failed to start service:", error);
    process.exit(1);
  }
}

bootstrap();
