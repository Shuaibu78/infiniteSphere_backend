import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import AuthRouter from "./api/auth/auth.route";
import UserRouter from "./api/user/user.route";
import api, { UnsupportedRouteHandler } from "./api";
import helmetCsp from "helmet-csp";
import { FOLDER_PATHS } from "./utils";

export const app = express();

const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
};

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

//App Setup
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmetCsp(cspConfig));
app.use(apiLimiter);
app.use(express.json());

//routes
app.use("/auth", AuthRouter);
app.use("/api", api);
app.use("/users", UserRouter);

app.use("/images/", express.static(FOLDER_PATHS.images));

//Logging
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("*", UnsupportedRouteHandler);
app.post("*", UnsupportedRouteHandler);
app.patch("*", UnsupportedRouteHandler);
app.delete("*", UnsupportedRouteHandler);
