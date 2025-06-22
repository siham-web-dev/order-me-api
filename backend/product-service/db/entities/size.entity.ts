import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Size {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string; // e.g., "Small", "Medium", "Large"

  @Column("decimal", { precision: 10, scale: 2 })
  priceModifier!: number; // Multiplier for base price (e.g., 0.8, 1.0, 1.2)

  @ManyToOne(() => Product, (product) => product.sizes, {
    onDelete: "CASCADE", // Delete size when product is deleted
  })
  product: Product = new Product();

  toGRPCMessage() {
    return {
      id: this.id,
      name: this.name,
      priceModifier: parseFloat(this.priceModifier.toString()), // Ensure proper number serialization
    };
  }
}
