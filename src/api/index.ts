import express from "express";
import { RequestAttr, Response } from "./../interfaces/auth.interface";

const router = express.Router();

export const UnsupportedRouteHandler = (_: RequestAttr, res: Response) =>
  res.status(400).send("Unsupported: Invalid route/method");

export default router;
