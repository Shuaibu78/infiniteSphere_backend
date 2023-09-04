import { Types } from "mongoose";
import { z } from "zod";

export const ZUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  googleId: z.string().optional(),
  avatar: z.string().optional(),
});

export const ZCreatUserSchema = ZUserSchema.extend({
  password: z.string(),
});

export const ZUserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ZUpdatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

export type IUser = z.infer<typeof ZUserSchema> & {
  _id?: Types.ObjectId;
  id?: string;
};
export type IUserLogin = z.infer<typeof ZUserLoginSchema>;
export type ICreateUser = z.infer<typeof ZCreatUserSchema>;
export type UpdatePasswordAttr = z.infer<typeof ZUpdatePasswordSchema>;
