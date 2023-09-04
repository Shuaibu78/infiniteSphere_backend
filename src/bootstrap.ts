import { createLogger } from "./utils/logger";

const logger = createLogger("ApplicationBootstrap");

// call all bootstrap functions here
export async function bootstrap() {
  return logger.info("Application bootstrap successful");
}
