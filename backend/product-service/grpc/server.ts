import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { ProductServiceImplementation } from "../services/product.service";

const PROTO_PATH = path.join(__dirname, "../../proto/product.proto");

export async function startGrpcServer() {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const productProto = grpc.loadPackageDefinition(packageDefinition)
    .product as any;

  const server = new grpc.Server();

  server.addService(
    productProto.ProductService.service,
    ProductServiceImplementation
  );

  return new Promise((resolve, reject) => {
    server.bindAsync(
      "0.0.0.0:50052",
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          reject(err);
          return;
        }
        server.start();
        console.log(`gRPC server running on port ${port}`);
        resolve(server);
      }
    );
  });
}
