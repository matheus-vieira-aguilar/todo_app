import { NextFunction, Request, Response } from "express";
import TokenService from "../service/token.service";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer", "").trim();
  const valid = TokenService.verify(token);

  if (!valid) {
    return res.status(401).json({ message: "Token is invalid or expired." });
  }

  next();
}
