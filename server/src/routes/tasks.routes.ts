import { Router } from "express";
import { tasksController } from "../controllers/tasks.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const tasksRoutes = Router();

tasksRoutes.put("/:id", asyncHandler(async (req, res) => {
  tasksController.update(req, res);
}));

tasksRoutes.delete("/:id", asyncHandler(async (req, res) => {
  tasksController.delete(req, res);
}));
