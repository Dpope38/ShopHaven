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

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.value}: ${err.path}!`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDb = (err) => {
  const msg = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
  return new AppError(msg, 400);
};

const validationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(`Error: ${err}`);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDb(err);
    if (err.code === 11000) err = handleDuplicateFieldsDb(err);
    if (err.name === "ValidationError") err = validationErrorDb(err);
    sendErrorProd(res, err);
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
export default globalError;
