import http from "http";
import { app } from "./app";
import { config } from "dotenv";
import { SendGrid, normalizePort } from "./utils";
import { connectDB } from "./config/db";
import { join } from "path";
import { createLogger } from "./utils/logger";
import { bootstrap } from "./bootstrap";

//Load configs
config({ path: join(__dirname, "../.env") });
const logger = createLogger("Server");

//Database connection
connectDB().then(() => bootstrap());

//Server setup
const PORT = normalizePort(process.env.PORT || 5002);
const server = http.createServer(app);

SendGrid.config();

server.listen(PORT, () => logger.info(`listening on port: ${PORT}`));
