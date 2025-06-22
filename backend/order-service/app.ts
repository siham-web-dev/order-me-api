import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./db/datasource";
import { OrderServiceImplementation } from "./services/order.service";

const PROTO_PATH = path.join(__dirname, "../proto/order.proto");

async function startServer() {
  await AppDataSource.initialize();

  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const orderProto = grpc.loadPackageDefinition(packageDefinition).order as any;

  const server = new grpc.Server();

  server.addService(
    orderProto.OrderService.service,
    OrderServiceImplementation
  );

  server.bindAsync(
    "0.0.0.0:50053",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to bind server:", err);
        process.exit(1);
      }
      server.start();
      console.log(`Order Service running on port ${port}`);
    }
  );
}

startServer();
