import Pino, { LoggerOptions } from "pino";
import Pretty from "pino-pretty";

const options: LoggerOptions = {
  timestamp: Pino.stdTimeFunctions.isoTime,
};

const stream = Pretty({
  colorize: true,
});

export const createLogger = (name: string) =>
  Pino({ ...options, name }, stream);
