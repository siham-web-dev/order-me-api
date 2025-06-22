import { AppDataSource } from "../db/datasource";
import { Order } from "../db/entities/order.entity";

export class OrderRepository {
  private orderRepo = AppDataSource.getRepository(Order);

  async createOrder(userId: string, items: any[]) {
    const order = this.orderRepo.create({ userId, items });
    return await this.orderRepo.save(order);
  }

  async findById(id: string) {
    return await this.orderRepo.findOne({
      where: { id },
      relations: ["items"],
    });
  }

  async findByUserId(userId: string) {
    return await this.orderRepo.find({
      where: { userId },
      relations: ["items"],
    });
  }
}
