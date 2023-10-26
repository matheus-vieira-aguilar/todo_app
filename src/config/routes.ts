import { Router } from "express";
import { container } from "tsyringe";
import AuthController from "../controller/auth.controller";
import { ListController } from "../controller/task.controller";
import UserController from "../controller/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { Validation } from "../middlewares/validation.middleware";
import { refreshTokenSchema } from "../schemas/refresh.token.schema";
import { taskSchema } from "../schemas/task.schema";
import { userSchema } from "../schemas/user.schema";
import { uuid } from "../schemas/uuid.schema";

export default async (router: Router): Promise<Router> => {
  const controller = container.resolve(ListController);
  const userController = new UserController();
  const authController = container.resolve(AuthController);

  router.get("/task", authMiddleware, (req, res) => controller.list(req, res));

  router.post(
    "/task",
    authMiddleware,
    Validation.body(taskSchema),
    (req, res) => controller.add(req, res)
  );

  router.put("/task/:id", authMiddleware, Validation.params(uuid), (req, res) =>
    controller.update(req, res)
  );

  router.patch(
    "/task/:id/done",
    authMiddleware,
    Validation.params(uuid),
    (req, res) => controller.done(req, res)
  );

  router.delete(
    "/task/:id",
    authMiddleware,
    Validation.params(uuid),
    (req, res) => controller.delete(req, res)
  );

  router.post("/user", Validation.body(userSchema), userController.store);

  router.post(
    "/auth",
    Validation.body(userSchema),
    authController.authenticate
  );

  router.post(
    "/refresh-token",
    Validation.body(refreshTokenSchema),
    authController.refresh
  );

  return router;
};
