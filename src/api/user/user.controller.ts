import { compare } from "bcryptjs";

import { saveFileToFolder } from "../../utils/file";
import { hashPassword } from "./../../models/user-password.model";
import { getErrorMessage } from "./../../utils/index";
import { RequestAttr, Response } from "./../../interfaces/auth.interface";
import { createLogger } from "./../../utils/logger";
import {
  UpdatePasswordAttr,
  ZUpdatePasswordSchema,
} from "./../../interfaces/user.interface";
import { constructError } from "./../../utils/exceptions";
import { User, UserPassword } from "./../../models";
import { Types } from "mongoose";

export const changePasswordHandler = async (
  req: RequestAttr,
  res: Response,
) => {
  const userId = req.user?.id;
  const logger = createLogger("ChangePasswordHandler");
  const errorBuilder = constructError(res);

  if (!userId) return errorBuilder(400)("Please login and try again");

  const result = ZUpdatePasswordSchema.safeParse(req.body);

  if (!result.success) {
    return errorBuilder(400)("Bad Request", "validation error", result.error);
  }

  const { currentPassword, newPassword } = req.body as UpdatePasswordAttr;

  try {
    const userPassword = await UserPassword.findOne({ userId });

    if (!userPassword) throw new Error("User passwor not found");

    if (!(await compare(currentPassword, userPassword.password))) {
      return errorBuilder(400)("Invalid password");
    }

    await UserPassword.updateOne(
      { _id: userPassword._id },
      { password: await hashPassword(newPassword) },
    );

    return res.json({
      successful: true,
      message: "Password updated successfully",
    });
  } catch (err: any) {
    logger.error({ err }, "failed to change password");
    errorBuilder(500)(getErrorMessage(err));
  }
};

export const updateUserProfilePictureHandler = async (
  req: RequestAttr,
  res: Response,
) => {
  const userId = req.user?.id;
  const fileBuffer = req.file?.buffer;
  const fileType = req.file?.mimetype;
  const data: Record<string, string> = {};
  try {
    if (!userId) return constructError(res)(400)("Please login and try again");

    if (fileBuffer && fileType) {
      const avatar = await saveFileToFolder(fileBuffer, fileType, "images");

      await User.findByIdAndUpdate(new Types.ObjectId(userId), {
        avatar,
      }).then((updated) => (data["avatar"] = updated?.avatar || ""));
    }

    return res.json({
      successful: true,
      message: "Profile picture updated successfully",
      data,
    });
  } catch (error) {
    createLogger("UpdateUserProfilePictureHandler").error(
      { error, userId },
      "failed to update profile picture",
    );
  }
};

export const getLoggedInUserHandler = async (req, res) => {
  const userId = req.user?.id;
  const logger = createLogger("GetLoggedInUserHandler");

  if (!userId) {
    return constructError(res)(401)(
      "Unauthorized",
      "Please login and try again",
    );
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return constructError(res)(404)("User not found");
    }

    return res.json({
      successful: true,
      message: "User fetched succesfully",
      data: user.toObject(),
    });
  } catch (err: any) {
    logger.error({ err }, "failed to get logged in user");
    constructError(res)(500)(getErrorMessage(err));
  }
};
