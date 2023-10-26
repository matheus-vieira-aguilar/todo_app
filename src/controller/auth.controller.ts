import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../data.source";
import RefreshToken from "../model/refresh.token";
import User from "../model/user";
import TokenService from "../service/token.service";
import { injectable } from "tsyringe";

@injectable()
export default class AuthController {
  /**
   * @openapi
   * '/auth':
   *  post:
   *     tags:
   *     - Auth
   *     summary: Autheticate the user and return the JWT token
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
   *              properties:
   *                id:
   *                  type: string
   *                  description: The user's ID
   *                token:
   *                  type: string
   *                  description: The authentication token
   *                refreshToken:
   *                  type: string
   *                  description: The refresh token
   *      401:
   *        description: Return when the user is invalid
   */
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const refreshRepository = AppDataSource.getRepository(RefreshToken);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User does not exists" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = TokenService.generate(user.id);

    const refreshToken = refreshRepository.create({
      userId: user.id,
    });

    await refreshRepository.save(refreshToken);

    return res.json({
      id: user.id,
      token,
      refreshToken,
    });
  }

  /**
   * @openapi
   * '/refresh-token':
   *  post:
   *     tags:
   *     - Auth
   *     summary: Refresh the Jwt session token
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *            schema:
   *              properties:
   *                refreshId:
   *                  type: string
   *                  description: Refresh token id
   *                userId:
   *                  type: string
   *                  description: User associated with the token
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              properties:
   *                token:
   *                  type: string # Assuming that 'token' is a string
   *                  description: The authentication token
   *      401:
   *        description: Return when the token is invalid or expired
   */
  async refresh(req: Request, res: Response) {
    const { refreshId, userId } = req.body;

    const refreshRepository = AppDataSource.getRepository(RefreshToken);

    const refreshToken = await refreshRepository.findOne({
      where: { id: refreshId, userId },
    });

    if (!refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const token = TokenService.generate(refreshToken.userId);

    return res.status(200).json({ token });
  }
}
