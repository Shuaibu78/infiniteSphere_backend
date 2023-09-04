import sgMail from "@sendgrid/mail";
import RandNum from "random-number-csprng";
import { EmailOpts } from "../interfaces";
import { resolve } from "path";
import { createLogger } from "./logger";
import { APP_NAME } from "./constants";

export const SendGrid = (() => {
  function config() {
    return sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);
  }

  async function sendMail(msg: Omit<EmailOpts, "from">) {
    return sgMail.send({
      ...msg,
      from: { email: `${process.env.MAIL_FROM}`, name: APP_NAME },
    });
  }

  return { config, sendMail };
})();

export function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

export const getErrorMessage = (err: any) => {
  let message =
    err?.response?.data?.error?.message ?? err?.message ?? err?.toString();

  if (message.includes("ECONNREFUSED")) {
    message = "Server is unreachable";
  }

  if (message) {
    return message;
  }

  return "Unrecognized error";
};

export const JSONSafeParse = (
  jsonString: string,
): Array<{ question?: string; questionType?: string }> => {
  if (!jsonString) {
    return [];
  }

  const firstChar = jsonString.indexOf("[");
  const lastChar = jsonString[jsonString.length - 1];

  // trim anythng before the questions array
  jsonString = jsonString.slice(firstChar, jsonString.length);

  if (lastChar !== "]") {
    jsonString = jsonString.slice(0, jsonString.lastIndexOf("}") + 1);
    jsonString = jsonString + "]";
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    createLogger("JSONSafeParse").error({ jsonString }, getErrorMessage(error));
    return [];
  }
};

export function getPercentage(devisor: number, dividend: number): number {
  return (devisor / Math.max(dividend, 1)) * 100 || 0;
}

export const getResetCodeExpireTime = () => {
  // 30 mins from current time
  return new Date(new Date().getTime() + 30 * 60 * 1000);
};

export const generateRandomNumber = async () => RandNum(125436, 998754);

const PATH_TO_PUBLIC_FOLDER = resolve(__dirname, "../../public");

export const FOLDER_PATHS = {
  images: resolve(PATH_TO_PUBLIC_FOLDER, "images"),
} as const;

export type TypeOfFilePath = keyof typeof FOLDER_PATHS;
