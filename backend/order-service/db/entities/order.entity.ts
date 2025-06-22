import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];

  @Column({ default: "pending" })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  toGRPCMessage() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items?.map((item) => item.toGRPCMessage()) || [],
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
