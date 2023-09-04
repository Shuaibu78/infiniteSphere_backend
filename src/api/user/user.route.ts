import express from "express";
import multer from "multer";

import { isAuth } from "./../../middleware/auth";
import {
  changePasswordHandler,
  getLoggedInUserHandler,
  updateUserProfilePictureHandler,
} from "./user.controller";

const router = express.Router();

const upload = multer();

router.post("/change-password", isAuth, changePasswordHandler);

router.post(
  "/update-avatar",
  isAuth,
  upload.single("file"),
  updateUserProfilePictureHandler,
);

router.get("/me", isAuth, getLoggedInUserHandler);

export default router;
