import { model, Schema, Types } from "mongoose";

export const VerificationTokenSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    isValid: {
      type: Boolean,
      default: true,
    },

    retries: {
      type: Number,
      default: 0,
    },

    expiresIn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const VerificationToken = model(
  "VerificationToken",
  VerificationTokenSchema,
);
