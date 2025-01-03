/* eslint-disable no-unused-vars */
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";
import generateToken from "../utils/generateToken.js";
import getToken from "../utils/tokenHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
import tokenHeader from "../utils/tokenHeader.js";

// @desc  Register User
// @route Post api/v1/users/register
// access Private/Admin
const registerUser = asyncErrorHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }
  const userInfo = await User.create({
    fullname,
    email: email.toLowerCase(),
    password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: {
      userInfo,
    },
  });
});

// Login User
const loginUser = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  // 2. Find user and explicitly select password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);
  console.log(token);
  // 3. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
    data: {
      user,
    },
  });
});

const getUserCtrl = asyncErrorHandler(async (req, res) => {
  const token = await getToken(req);
  const header = await tokenHeader(req);
  console.log(header);
  const verified = await verifyToken(token);

  if (!verified) {
    throw new AppError("Invalid token", 401);
  }

  res.status(200).json({
    status: "success",
  });
});

export { registerUser, loginUser, getUserCtrl };
