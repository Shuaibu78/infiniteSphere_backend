import { model, Schema } from "mongoose";

//define user model
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    googleId: {
      type: String,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

//export model class
export const User = model("User", userSchema);
