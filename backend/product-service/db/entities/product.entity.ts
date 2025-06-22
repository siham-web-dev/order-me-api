import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Size } from "./size.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column("decimal")
  basePrice!: number;

  @Column("text", { array: true })
  ingredients!: string[];

  @OneToMany(() => Size, (size) => size.product)
  sizes!: Size[];

  toGRPCMessage() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      basePrice: this.basePrice,
      ingredients: this.ingredients,
      sizes: this.sizes?.map((size) => size.toGRPCMessage()) || [],
    };
  }
}
