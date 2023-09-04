import Queue from "queue";
import { createLogger } from "../utils/logger";

const queue = new Queue({ autostart: true, concurrency: 10 });

const logger = createLogger("TaksQueue");

// notify when jobs complete
queue.addListener("success", (e) => {
  logger.info({ result: e.detail?.result }, "job finished processing");
});

// or when jobs fail
queue.addListener("error", (e) => {
  // stack: e?.stack ?? ""
  logger.error({ error: e?.message }, "job failed processing");
});

export const enqueueTask = (task: () => Promise<any>) => {
  return queue.push((cb: unknown) => task().then(() => cb));
};
