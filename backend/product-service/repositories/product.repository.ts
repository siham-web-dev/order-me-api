import { AppDataSource } from "../db";
import { Product } from "../db/entities/product.entity";

export class ProductRepository {
  private productRepo = AppDataSource.getRepository(Product);

  async findAll() {
    return this.productRepo.find({
      relations: ["sizes"],
    });
  }

  async findById(id: string) {
    return this.productRepo.findOne({
      where: { id },
      relations: ["sizes"],
    });
  }

  async createProduct(productData: any) {
    const product = this.productRepo.create(productData);
    return await this.productRepo.save(product);
  }

  async update(id: string, productData: any) {
    await this.productRepo.update(id, productData);
    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.productRepo.delete(id);
    return result.affected && result.affected > 0;
  }
}
