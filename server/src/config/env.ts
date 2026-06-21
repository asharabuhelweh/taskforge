import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value ?? "4000");
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("PORT must be a positive integer");
  }
  return parsed;
};

const parseCorsOrigins = (value: string | undefined): string[] => {
  const fallback = "http://localhost:5173,http://127.0.0.1:5173";

  return (value ?? fallback)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databasePath:
    process.env.DATABASE_PATH ??
    path.resolve(process.cwd(), "data", "taskforge.sqlite"),
  jwtSecret: process.env.JWT_SECRET ?? "taskforge-local-development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
};
