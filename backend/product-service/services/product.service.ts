import * as grpc from "@grpc/grpc-js";
import { ProductRepository } from "../repositories/product.repository";

const productRepo = new ProductRepository();

export const ProductServiceImplementation = {
  async GetProduct(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { id } = call.request;
      const product = await productRepo.findById(id);

      if (!product) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Product not found",
        });
      }

      callback(null, product.toGRPCMessage());
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async CreateProduct(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const product = await productRepo.createProduct(call.request);

      callback(null, product);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async UpdateProduct(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { id } = call.request;
      const product = await productRepo.update(id, call.request);
      if (!product) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Product not found",
        });
      }

      callback(null, product.toGRPCMessage());
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async DeleteProduct(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { id } = call.request;
      const success = await productRepo.delete(id);

      callback(null, { success });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async GetProducts(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const products = await productRepo.findAll();
      callback(null, { products: products.map((p) => p.toGRPCMessage()) });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
