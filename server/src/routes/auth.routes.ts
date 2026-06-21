import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const authRoutes = Router();

authRoutes.post("/login", asyncHandler(async (req, res) => {
  authController.login(req, res);
}));
