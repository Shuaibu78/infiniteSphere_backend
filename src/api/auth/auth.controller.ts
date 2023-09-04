import { resetPasswordEmail } from "./../../utils/email-temp/resetPass.template";
import {
  SendGrid,
  generateRandomNumber,
  getResetCodeExpireTime,
} from "./../../utils";
import { RequestAttr, Response } from "./../../interfaces/auth.interface";
import { createLogger } from "./../../utils/logger";
import { constructError } from "./../../utils/exceptions";
import { startSession } from "../../config/db";
import { sign } from "jsonwebtoken";
import { User, UserPassword, VerificationToken } from "./../../models";
import { compare } from "bcryptjs";
import {
  ZCreatUserSchema,
  ZUserLoginSchema,
} from "./../../interfaces/user.interface";
import { hashPassword } from "./../../models/user-password.model";

export const createUserHandler = async (req: RequestAttr, res: Response) => {
  const result = ZCreatUserSchema.safeParse(req.body);

  if (!result.success) {
    return constructError(res)()(
      "Bad Request",
      "validation error",
      result.error,
    );
  }

  const session = await startSession();
  const { email, firstName, lastName, password } = req.body;
  const logger = createLogger("CreateUserHandler");

  logger.info(
    { email, firstName, lastName },
    `creating user "${firstName} ${lastName}"`,
  );

  try {
    session.startTransaction();
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      await session.abortTransaction();
      await session.endSession();

      return constructError(res)()(
        "Bad request",
        "User with this email already exists.",
      );
    }

    const user = new User({
      email,
      firstName,
      lastName,
    });

    const savedUser = await user.save({ session });

    await UserPassword.create(
      [
        {
          userId: savedUser.id,
          password,
        },
      ],
      { session },
    );

    const token = sign({ id: savedUser.id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "2d",
    });

    logger.info(
      { email, firstName, lastName },
      `user created "${firstName} ${lastName}"`,
    );

    await session.commitTransaction();

    res.status(201).json({
      token,
      user: {
        id: savedUser.id,
        createdAt: savedUser.createdAt,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        email: savedUser.email,
        dateJoined: savedUser.createdAt,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

    logger.error({ err });
    constructError(res)(500)("Something went wrong, please try again.");
  }
};

export const loginHandler = async (req, res) => {
  const result = ZUserLoginSchema.safeParse(req.body);

  if (!result.success) {
    return constructError(res)()(
      "Bad Request",
      "validation error",
      result.error,
    );
  }

  const { email, password } = req.body;
  const logger = createLogger("LoginHandler");

  logger.info({ email }, "attempting login");
  try {
    const user = await User.findOne({ email });

    if (!user)
      return constructError(res)(400)(
        "Bad Request",
        "invalid email or password",
      );

    const userPassword = await UserPassword.findOne({ userId: user.id });

    if (!userPassword) {
      logger.info({ email }, "invalid login credentials");

      return constructError(res)(400)(
        "Bad Request",
        "invalid email or password",
      );
    }

    const passwordMatch = await compare(password, userPassword.password);

    if (!passwordMatch)
      return constructError(res)(400)(
        "Bad Request",
        "invalid email or password",
      );

    // TODO: referesh token
    const token = sign({ id: user.id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "2d",
    });

    logger.info({ email }, "login successful");

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar,
        dateJoined: user.createdAt,
      },
    });
  } catch (err) {
    logger.error({ email, err }, "failed to login");
    return constructError(res)(500)("failed to login, please try again");
  }
};

export const sendPasswordResetTokenHandler = async (
  req: RequestAttr,
  res: Response,
) => {
  const { email } = req.body;

  if (!email) return constructError(res)()("Bad request", "Email not provided");

  const response = {
    successful: true,
    message: "Password reset code has been sent to your email.",
  };

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json(response);
    }

    const savedToken = await VerificationToken.create({
      userId: user._id,
      token: await generateRandomNumber(),
      expiresIn: getResetCodeExpireTime(),
    });

    if (!savedToken) throw new Error("failed to save token");

    await SendGrid.sendMail({
      ...resetPasswordEmail(user.lastName, savedToken.token),
      to: `${user.email}`,
    });

    return res.json(response);
  } catch (err) {
    createLogger("SendPasswordResetTokenHandler").error(
      { err },
      "failed to send password reset token to email",
    );
    constructError(res)(500)("failed to send password reset token to email");
  }
};

export const resetUserPasswordHandler = async (
  req: RequestAttr,
  res: Response,
) => {
  const { resetCode, password } = req.body;

  if (!resetCode) return constructError(res)()("Reset code not provided");

  if (!password) return constructError(res)()("Password not provided");

  try {
    const token = await VerificationToken.findOne({
      token: resetCode,
    }).sort({ createdAt: -1 });

    if (!token || new Date(token.expiresIn) < new Date())
      return constructError(res)()("Invalid/expired reset code");

    await UserPassword.findOneAndUpdate(
      { userId: token.userId },
      { password: await hashPassword(password) },
    );

    return res.json({
      successful: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    createLogger("ResetUserPasswordHandler").error(
      { err },
      "failed to reset password",
    );
    constructError(res)(500)("failed to reset password");
  }
};
