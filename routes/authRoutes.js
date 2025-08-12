import express from "express";

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  signout
} from "../controller/authController.js";

const router = express.Router();

router
  .post("/signup", signup)
  .post("/login", login)
  .post("/forgot-password", forgotPassword)
  .post("/update-password", protect, updatePassword)
  .post("/reset-password", resetPassword)
  .get("/signout", signout);

export default router;