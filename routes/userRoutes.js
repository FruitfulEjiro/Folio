import express from "express";

import { updateMe, deleteMe, getMe } from "../controller/userController.js";
import { protect } from "../controller/authController.js";

const router = express.Router();

router
  .get("/me", protect, getMe)
  .patch("/update", protect, updateMe)
  .delete("/delete", protect, deleteMe);

export default router;
