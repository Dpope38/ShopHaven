/**
 * Handles CastError from the database.
 * @param {Object} err - The error object.
 * @returns {AppError} - The formatted AppError object.
 */

/**
 * Handles duplicate field errors from the database.
 * @param {Object} err - The error object.
 * @returns {AppError} - The formatted AppError object.
 */

/**
 * Handles validation errors from the database.
 * @param {Object} err - The error object.
 * @returns {AppError} - The formatted AppError object.
 */

/**
 * Sends error response in development mode.
 * @param {Object} err - The error object.
 * @param {Object} res - The response object.
 */

/**
 * Sends error response in production mode.
 * @param {Object} err - The error object.
 * @param {Object} res - The response object.
 */

/**
 * Global error handling middleware.
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import AppError from "../utils/appError.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

// handle cast error
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handling duplicate fields error
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

// Handling validation error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// error handling for development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// error handling for production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "development") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError")
      err = new AppError("Invalid token. Please log in again", 401);
    if (err.name === "TokenExpiredError")
      err = new AppError("Your token has expired! Please log in again", 401);

    sendErrorProd(err, res);
  }
};

export default globalError;
