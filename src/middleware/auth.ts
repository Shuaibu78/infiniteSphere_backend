import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { RequestAttr } from "../interfaces/auth.interface";

export const isAuth = (req: RequestAttr, res: Response, next: NextFunction) => {
  let token = req.header("Authorization");

  if (!token)
    return res.status(401).json({
      statusCode: 401,
      error: "Unauthorized",
    });

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decodedToken = verify(token, `${process.env.JWT_SECRET}`);

    req.user = decodedToken as RequestAttr["user"];
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
