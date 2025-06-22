import * as grpc from "@grpc/grpc-js";
import { UserRepository } from "../repositories/user.repository";
import { ProfileRepository } from "../repositories/profile.repository";
import bcrypt from "bcrypt";

const userRepository = new UserRepository();
const profileRepository = new ProfileRepository();

export const UserServiceImplementation = {
  async CreateUser(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { email, password, fullName, phone } = call.request;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepository.createUser(
        email,
        hashedPassword,
        phone
      );
      await profileRepository.createProfile(user.id, fullName);

      callback(null, user.toGRPCMessage());
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      callback({
        code: message.includes("exists")
          ? grpc.status.ALREADY_EXISTS
          : grpc.status.INTERNAL,
        message,
      });
    }
  },

  async GetUser(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { id } = call.request;
      const user = await userRepository.findById(id);

      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "User not found",
        });
      }

      callback(null, user.toGRPCMessage());
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async UpdateUserProfile(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { userId, fullName, bio, avatarUrl } = call.request;
      await profileRepository.updateProfile(userId, fullName, bio, avatarUrl);
      const user = await userRepository.findById(userId); // Refresh user data

      callback(null, user?.toGRPCMessage());
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async DeleteUser(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const { id } = call.request;
      await userRepository.deleteUser(id);

      callback(null, { success: true });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async ListUsers(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const users = await userRepository.listUsers();
      callback(null, { users: users.map((u) => u.toGRPCMessage()) });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
};
