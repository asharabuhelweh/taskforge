import { Router } from "express";
import { projectsController } from "../controllers/projects.controller";
import { tasksController } from "../controllers/tasks.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const projectsRoutes = Router();

projectsRoutes.get("/", asyncHandler(async (req, res) => {
  projectsController.list(req, res);
}));

projectsRoutes.post("/", asyncHandler(async (req, res) => {
  projectsController.create(req, res);
}));

projectsRoutes.put("/:id", asyncHandler(async (req, res) => {
  projectsController.update(req, res);
}));

projectsRoutes.delete("/:id", asyncHandler(async (req, res) => {
  projectsController.delete(req, res);
}));

projectsRoutes.get("/:projectId/tasks", asyncHandler(async (req, res) => {
  tasksController.listByProject(req, res);
}));

projectsRoutes.post("/:projectId/tasks", asyncHandler(async (req, res) => {
  tasksController.create(req, res);
}));
