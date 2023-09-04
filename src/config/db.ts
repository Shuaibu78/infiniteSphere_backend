import { createLogger } from "./../utils/logger";
import mongoose from "mongoose";

const logger = createLogger("Db-config");

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/resume-summarizer`, {});

    logger.info(`🎉 MongoDB Connected`);
  } catch (err) {
    logger.error(`❌ ${err}`);
    process.exit(1);
  }
};

export const startSession = () => mongoose.connection.startSession();
