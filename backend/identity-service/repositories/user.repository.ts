import { AppDataSource } from "../db";
import { User } from "../db/entities/user.entity";
import * as jwt from "jsonwebtoken";

export class UserRepository {
  private userRepo = AppDataSource.getRepository(User);

  async createUser(email: string, password: string, phone: string) {
    const user = this.userRepo.create({ email, password, phone });
    return await this.userRepo.save(user);
  }

  async findById(id: string) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async updateUser(id: string, updates: Partial<User>) {
    await this.userRepo.update(id, updates);
    return this.findById(id);
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);
    if (!user) throw new Error("User  not found");
    await this.userRepo.remove(user);
  }

  async listUsers() {
    return await this.userRepo.find();
  }

  async generateToken(user: User): Promise<string> {
    try {
      const payload = {
        userId: user.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as any, {
        expiresIn: process.env.JWT_EXPIRES_IN as any,
        algorithm: "HS256",
      });

      return token;
    } catch (error) {
      console.error("Failed to generate token:", error);
      throw new Error("Token generation failed");
    }
  }
}
