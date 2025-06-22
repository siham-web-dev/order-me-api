import { credentials } from "@grpc/grpc-js";

const productServiceClient = {
  serviceUrl: "0.0.0.0:50052",
  credentials: credentials.createInsecure(),
};

const identityServiceClient = {
  serviceUrl: "0.0.0.0:50051",
  credentials: credentials.createInsecure(),
};

const orderServiceClient = {
  serviceUrl: "0.0.0.0:50053",
  credentials: credentials.createInsecure(),
};

export const grpcConfig = {
  productService: productServiceClient,
  identityService: identityServiceClient,
  orderService: orderServiceClient,
};
