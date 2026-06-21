import express from "express";
import cors from "cors";
import { env } from "./config/env";
import "./db/database";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { apiRoutes } from "./routes";

export const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
