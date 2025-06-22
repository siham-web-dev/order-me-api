import * as grpc from "@grpc/grpc-js";
import { OrderRepository } from "../repositories/order.repository";

const orderRepo = new OrderRepository();

export const OrderServiceImplementation = {
  async CreateOrder(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { userId, items } = call.request;
      const order = await orderRepo.createOrder(userId, items);
      callback(null, order.toGRPCMessage());
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async GetOrder(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { id } = call.request;
      const order = await orderRepo.findById(id);

      if (!order) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Order not found",
        });
      }

      callback(null, order.toGRPCMessage());
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async ListOrders(call: grpc.ServerWritableStream<any, any>) {
    try {
      const { userId } = call.request;
      const orders = await orderRepo.findByUserId(userId);

      for (const order of orders) {
        call.write(order.toGRPCMessage());
      }

      call.end();
    } catch (error) {
      call.emit("error", {
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
