import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  phone?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile!: Profile;

  // Method to convert User entity to gRPC message
  toGRPCMessage() {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt.toISOString(), // Convert Date to string
      profile: this.profile?.toGRPCMessage(), // Call toGRPCMessage on Profile if it exists
    };
  }
}
