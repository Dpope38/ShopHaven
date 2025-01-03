/* eslint-disable no-unused-vars */
import tokenHeader from "../utils/tokenHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import AppError from "../utils/appError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const isLogin = asyncErrorHandler(async (req, res, next) => {
  const token = await tokenHeader(req);
  if (!token) {
    throw new AppError("Please login to access this route", 401);
  }
  const decoded = await verifyToken(token);

  if (decoded) {
    req.userAuth = decoded;
    next();
  } else {
    throw new AppError("Invalid token or Token Expired", 401);
  }
});

export default isLogin;
