import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./order.entity";

@Entity("items_of_order")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  productId!: string;

  @Column()
  quantity!: number;

  @Column("decimal")
  price!: number;

  @ManyToOne(() => Order, (order) => order.items)
  order!: Order;

  toGRPCMessage() {
    return {
      id: this.id,
      productId: this.productId,
      quantity: this.quantity,
      price: this.price,
    };
  }
}
