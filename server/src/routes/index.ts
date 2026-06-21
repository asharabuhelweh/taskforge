import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { authRoutes } from "./auth.routes";
import { projectsRoutes } from "./projects.routes";
import { tasksRoutes } from "./tasks.routes";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/projects", requireAuth, projectsRoutes);
apiRoutes.use("/tasks", requireAuth, tasksRoutes);
