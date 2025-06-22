import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { grpcConfig } from "../config/grpc.config";
import { Order, OrderItem } from "../types/order.types"; // Adjust the import based on your project structure

const PROTO_PATH = path.join(__dirname, "../../proto/order.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderProto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new orderProto.order.OrderService(
  grpcConfig.orderService.serviceUrl,
  grpcConfig.orderService.credentials
);

export class OrderClient {
  public static createOrder(order: Omit<Order, "id">): Promise<Order> {
    return new Promise((resolve, reject) => {
      client.CreateOrder(order, (err: grpc.ServiceError, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: response.id,
            ...order,
          });
        }
      });
    });
  }

  public static getOrderById(id: string): Promise<Order> {
    return new Promise((resolve, reject) => {
      client.GetOrder({ id }, (err: grpc.ServiceError, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: response.id,
            userId: response.userId,
            items: response.items,
            status: response.status,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
          });
        }
      });
    });
  }

  public static listOrders(userId: string): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      const call = client.ListOrders({ userId });
      const orders: Order[] = [];

      call.on("data", (order: any) => {
        orders.push({
          id: order.id,
          userId: order.userId,
          items: order.items,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        });
      });

      call.on("end", () => {
        resolve(orders);
      });

      call.on("error", (err: grpc.ServiceError) => {
        reject(err);
      });
    });
  }
}
