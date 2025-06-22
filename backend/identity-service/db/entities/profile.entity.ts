import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { User } from "./user.entity";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  fullName!: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.profile)
  user!: User;

  // Method to convert Profile entity to gRPC message
  toGRPCMessage() {
    return {
      id: this.id,
      fullName: this.fullName,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt.toISOString(), // Convert Date to string
      updatedAt: this.updatedAt.toISOString(), // Convert Date to string
    };
  }
}
