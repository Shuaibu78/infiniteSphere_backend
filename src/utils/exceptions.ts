import { Response } from "express";
import { ZodError } from "zod";

type IExceptionPayload = Record<string, unknown>;

interface IExceptionOptions {
  status?: number;
  title?: string;
  message?: string;
  data?: IExceptionPayload;
}

export class ExceptionHandler {
  res: Response;

  status = 500;
  data: IExceptionPayload = {};
  title = "An Error Occured";
  message =
    "something went wrong, try again. If the problem persists, contact support.";

  constructor(res: Response, level: string, options: IExceptionOptions = {}) {
    this.res = res;
    options.status && this.setStatus(options.status);
    options.title && this.set(options);
  }

  getError() {
    return this._constructResponse();
  }

  setStatus(status: number) {
    this.status = status;
    return this;
  }

  private _constructResponse() {
    return {
      status: this.status,
      error: `${this.title} error`,
      message: this.message,
      data: this.data ?? {},
    };
  }

  set({ title, message, data, status }: IExceptionOptions) {
    this.title = title || this.title;
    this.status = status || this.status;
    this.message = message || this.message;
    this.data = data || this.data;
    return this;
  }
}

export const constructError =
  (res: Response) =>
  (status = 400) =>
  (title: string, message?: string, data: IExceptionOptions = {}) => {
    return res.status(status).json({
      statusCode: status,
      error: title,
      message,
      data,
    });
  };

export const UnauthorizedException = (res: Response) =>
  constructError(res)(401)("Unauthorized");

export const BadRequestException =
  (res: Response) => (message: string | Record<string, unknown> | ZodError) =>
    constructError(res)(400)(
      "Bad Request",
      typeof message === "string" ? message : JSON.stringify(message),
    );
