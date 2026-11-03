import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

// Parses req.body with the schema and replaces it with the cleaned data (trimmed, lowercased, etc.).
// A ZodError is passed to the global error handler, which responds with 400.
export const validateRequest = (schema: ZodType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body ?? {});
      next();
    } catch (error) {
      next(error);
    }
  };
};
