import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY as string;

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const apiKey = req.header("x-api-key");

    if (apiKey == API_KEY) {
        return next();
    }

    console.log("An unauthorized connection was detected.");
    return res.status(401).json({ status: "unauthorized" });
};