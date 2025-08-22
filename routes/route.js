import { Router } from "express";
import authRoutes from "./authRoutes.js";
import portfolioRoutes from "./portfolioRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/portfolio", portfolioRoutes);

export default router;
