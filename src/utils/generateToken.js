/* eslint-disable no-undef */
import jwt from "jsonwebtoken";

//
const generateToken = (userId) => {
  if (!process.env.JWT_TOKEN) {
    throw new Error("JWT_Token is not defined");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "1d"; // Default to 1 day

  return jwt.sign({ id: userId }, process.env.JWT_TOKEN, { expiresIn });
};

export default generateToken;
