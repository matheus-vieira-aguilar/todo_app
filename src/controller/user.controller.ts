import { AppDataSource } from "../data.source";
import { Request, Response } from "express";
import User from "../model/user";

export default class UserController {
  /**
   * @openapi
   * '/user':
   *  post:
   *     tags:
   *     - User
   *     summary: Add a new user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/User'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *               $ref: '#/components/schemas/User'
   *      409:
   *        description: User already exists
   */
  async store(req: Request, res: Response) {
    const repository = AppDataSource.getRepository(User);

    const { email, password } = req.body;

    const exists = await repository.findOne({ where: { email } });

    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = repository.create({ email, password });
    await repository.save(user);

    return res.json(user);
  }
}
