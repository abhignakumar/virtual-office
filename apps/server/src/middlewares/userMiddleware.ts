import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({
      message: "Authorization header doen not exist.",
    });
    return;
  }

  const token = header?.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "Authorization token doen not exist.",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authorization token is invalid.",
      error,
    });
    return;
  }
}
