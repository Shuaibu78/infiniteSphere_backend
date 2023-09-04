import { Request } from "express";

export interface RequestAttr extends Request {
  user?: {
    id: string;
  };
}

export { Response } from "express";
