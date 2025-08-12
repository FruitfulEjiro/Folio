import { Router } from "express";
import authRoutes from "./authRoutes.js";
import portfolioRoutes from "./portfolioRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/portfolio", portfolioRoutes);

export default router;
