import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { grpcConfig } from "../config/grpc.config";
import { User } from "../types/user.types"; // Adjust the import based on your project structure

const PROTO_PATH = path.join(__dirname, "../../proto/identity.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const identityProto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new identityProto.identity.IdentityService(
  grpcConfig.identityService.serviceUrl,
  grpcConfig.identityService.credentials
);

export class IdentityClient {
  public static register(user: Omit<User, "id">): Promise<User> {
    return new Promise((resolve, reject) => {
      client.CreateUser(user, (err: grpc.ServiceError, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: response.id,
            ...user,
          });
        }
      });
    });
  }

  public static login(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      client.loginUser(
        { email, password },
        (err: grpc.ServiceError, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.token);
          }
        }
      );
    });
  }

  public static verifyToken(
    token: string
  ): Promise<{ isValid: boolean; user: User }> {
    return new Promise((resolve, reject) => {
      client.VerifyToken({ token }, (err: grpc.ServiceError, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            isValid: response.isValid,
            user: response.user,
          });
        }
      });
    });
  }
}
