import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { AuthServiceImplementation } from "../services/auth.service";
import { UserServiceImplementation } from "../services/user.service";

const PROTO_PATH = path.join(__dirname, "../../proto/identity.proto");

export async function startGrpcServer() {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const identityProto = grpc.loadPackageDefinition(packageDefinition)
    .identity as any;

  const server = new grpc.Server();

  server.addService(identityProto.IdentityService.service, {
    ...AuthServiceImplementation,
    ...UserServiceImplementation,
  });

  return new Promise((resolve, reject) => {
    server.bindAsync(
      "0.0.0.0:50051",
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
