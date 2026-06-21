import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { type JwtPayload } from "../types/domain";
import { HttpError } from "../utils/httpError";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorization = req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    next(new HttpError(401, "Missing authorization token"));
    return;
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    req.user = jwt.verify(token, env.jwtSecret) as JwtPayload;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
};
