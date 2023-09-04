import express from "express";
import {
  createUserHandler,
  loginHandler,
  resetUserPasswordHandler,
  sendPasswordResetTokenHandler,
} from "./auth.controller";

const router = express.Router();

router.get("/", (req, res) => res.send("Hello Auth Route"));

//Create user router
router.post("/signup", createUserHandler);

//User sign-in route
router.post("/login", loginHandler);

router.post("/get-password-reset-token", sendPasswordResetTokenHandler);

router.post("/reset-password", resetUserPasswordHandler);

export default router;
