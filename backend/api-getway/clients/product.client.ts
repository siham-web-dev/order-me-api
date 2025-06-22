import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { grpcConfig } from "../config/grpc.config";
import { Product } from "../types/product.types";

const PROTO_PATH = path.join(__dirname, "../../proto/product.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new productProto.product.ProductService(
  grpcConfig.productService.serviceUrl,
  grpcConfig.productService.credentials
);

export class ProductClient {
  public static getAllProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      client.GetProducts({}, (err: grpc.ServiceError, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            response.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              basePrice: p.basePrice,
              ingredients: p.ingredients,
              sizes:
                p.sizes?.map((s: any) => ({
                  id: s.id,
                  name: s.name,
                  priceModifier: s.priceModifier,
                })) || [],
            }))
          );
        }
      });
    });
  }

  public static getProductById(id: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      client.GetProduct({ id }, (err: grpc.ServiceError, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: response.id,
            name: response.name,
            description: response.description,
            basePrice: response.basePrice,
            ingredients: response.ingredients,
            sizes:
              response.sizes?.map((s: any) => ({
                id: s.id,
                name: s.name,
                priceModifier: s.priceModifier,
              })) || [],
          });
        }
      });
    });
  }

  public static createProduct(product: Omit<Product, "id">): Promise<Product> {
    return new Promise((resolve, reject) => {
      client.CreateProduct(
        {
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          ingredients: product.ingredients,
        },
        (err: grpc.ServiceError, response: any) => {
          console.log("error => ", response);

          if (err) {
            reject(err);
          } else {
            resolve({
              id: response.id,
              ...product,
              sizes: [],
            });
          }
        }
      );
    });
  }

  public static updateProduct(product: Product): Promise<Product> {
    return new Promise((resolve, reject) => {
      client.UpdateProduct(
        {
          id: product.id,
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          ingredients: product.ingredients,
        },
        (err: grpc.ServiceError, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...product,
              sizes: product.sizes,
            });
          }
        }
      );
    });
  }

  public static deleteProduct(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      client.DeleteProduct({ id }, (err: grpc.ServiceError, response: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.success);
        }
      });
    });
  }

  public static getProductSizes(productId: string): Promise<Size[]> {
    return new Promise((resolve, reject) => {
      client.GetProduct(
        { id: productId },
        (err: grpc.ServiceError, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              response.sizes?.map((s: any) => ({
                id: s.id,
                name: s.name,
                priceModifier: s.priceModifier,
              })) || []
            );
          }
        }
      );
    });
  }
}

interface Size {
  id: string;
  name: string;
  priceModifier: number;
}
