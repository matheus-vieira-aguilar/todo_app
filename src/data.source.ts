import { DataSource } from "typeorm";
import Task from "./model/task";
import User from "./model/user";
import RefreshToken from "./model/refresh.token";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "todo_app",
  synchronize: true,
  logging: true,
  entities: [User, Task, RefreshToken],
  subscribers: [],
  migrations: ["src/database/migrations"],
});
