import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export class Validation {
  static body(schema: Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      console.log("on middleware validation");
      const validationResult = schema.validate(req.body);

      const { error } = validationResult;

      if (error) {
        return res.status(400).json(error);
      }

      next();
    };
  }

  static params(schema: Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const validationResult = schema.validate(req.params);

      const { error } = validationResult;

      if (error) {
        return res.status(400).json(error);
      }

      next();
    };
  }
}
