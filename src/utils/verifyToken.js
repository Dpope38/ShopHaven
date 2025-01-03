/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import { promisify } from "util";
import AppError from "./appError.js";

const verifyToken = async (token) => {
  if (!token) {
    throw new AppError("No token provided", 401);
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);
    return decoded;
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid token", 401);
    }
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    }
    throw new AppError("Token verification failed", 401);
  }
};

export { verifyToken };
