import {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res: Response,
  _next,
) => {
  void _next;

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message =
    error instanceof Error ? error.message : "Unexpected server error";

  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : message,
    ...(env.nodeEnv !== "production" && statusCode === 500
      ? { detail: message }
      : {}),
  });
};
