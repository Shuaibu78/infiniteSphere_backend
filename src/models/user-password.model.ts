import { genSalt, hash } from "bcryptjs";
import { model, Schema, Types } from "mongoose";

//define user password model
const userPasswordSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const hashPassword = async (password: string) => {
  return hash(password, await genSalt(10));
};

userPasswordSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);

    next();
  } catch (error: any) {
    return next(error);
  }
});

//export model class
export const UserPassword = model("UserPassword", userPasswordSchema);
