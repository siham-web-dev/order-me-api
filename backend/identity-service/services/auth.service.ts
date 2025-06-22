import * as grpc from "@grpc/grpc-js";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepository = new UserRepository();

export const AuthServiceImplementation = {
  async loginUser(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { email, password } = call.request;
      const user = await userRepository.findByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return callback({
          code: grpc.status.UNAUTHENTICATED,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      callback(null, { token, user: user.toGRPCMessage() });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
  async VerifyToken(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const token = call.request.token;

      if (!token) {
        return callback({
          code: grpc.status.UNAUTHENTICATED,
          message: "No token provided",
        });
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        return callback({
          code: grpc.status.UNAUTHENTICATED,
          message: "User not found",
        });
      }
      callback(null, {
        isValid: true,
        user: {
          userId: decoded.userId,
          email: decoded.email,
        },
      });
    } catch (error) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        message: "Invalid or expired token",
      });
    }
  },
};
