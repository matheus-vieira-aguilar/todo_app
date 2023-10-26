import "reflect-metadata";

import dotenv from "dotenv";
import express from "express";
import routerFunction from "./config/routes";
import { AppDataSource } from "./data.source";
import swaggerDocs from "./swagger";

const boostrap = async () => {
  dotenv.config();
  const app = express();
  const router = express.Router();

  app.use(express.json());

  await routerFunction(router);

  app.use(router);

  const port = Number(process.env.APP_PORT) ?? 3030;

  app.listen(port, () => {
    swaggerDocs(app, port);
    console.log(`Application running on port ${port}`);
  });
};

const main = async () => {
  await AppDataSource.initialize();
  await boostrap();
};

main().catch((error) => {
  console.error(error);
});
