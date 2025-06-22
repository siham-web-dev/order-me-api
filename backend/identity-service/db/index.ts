import { DataSource } from "typeorm";
import { User } from "./entities/user.entity"; // Import your entities
import { Profile } from "./entities/profile.entity";

console.log(process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Profile],
  synchronize: true,
});
