import { Router } from "express";
import { checkUsername, createPortfolio, fetchUserPortfolio } from "../controller/portfolioController.js";

const router = Router();

router.post("/generate-portfolio", createPortfolio);
router.get("/get/:slug", fetchUserPortfolio)
router.get("/check-username/:username", checkUsername)

export default router;
