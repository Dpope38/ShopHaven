/* eslint-disable no-undef */
/**
 * @desc Register a new user
 * @route POST /api/v1/users/register
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.fullname - Full name of the user
 * @param {string} req.body.email - Email of the user
 * @param {string} req.body.password - Password of the user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, and user data
 */

/**
 * @desc Login a user
 * @route POST /api/v1/users/login
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - Email of the user
 * @param {string} req.body.password - Password of the user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, token, and user data
 */

/**
 * @desc Get user details
 * @route GET /api/v1/users/me
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.userAuth - Authenticated user ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status and user data
 */

/**
 * @desc Update user's shipping address
 * @route PUT /api/v1/users/shipping-address
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.firstname - First name of the user
 * @param {string} req.body.lastname - Last name of the user
 * @param {string} req.body.address - Address of the user
 * @param {string} req.body.city - City of the user
 * @param {string} req.body.postalCode - Postal code of the user
 * @param {string} req.body.province - Province of the user
 * @param {string} req.body.country - Country of the user
 * @param {string} req.body.phone - Phone number of the user
 * @param {Object} res - Express response object
 * @param {Object} next - Express next middleware function
 * @returns {Object} JSON response with status, message, and updated user data
 */
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
const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { fullname, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw next(new AppError("User already exists", 400));
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

// @desc  Register User
// @route Post api/v1/users/login
// access Private/Admin
const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw next(new AppError("Please provide email and password", 400));
  }

  // 2. Find user and explicitly select password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw next(new AppError("Invalid email or password", 401));
  }

  const token = generateToken(user._id);
  // 3. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw next(new AppError("Invalid email or password", 401));
  }
  res.cookie("token", token, {
    maxAge: process.env.JWT_EPXPIRES_IN,
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
    data: {
      user,
    },
  });
});

// @desc  Get User
// @route GET api/v1/users/id
// access Private/Admin
const getUserByIdCtrl = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.userAuth).populate("orders");
  if (!user) {
    throw next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc  Logout as User
// @route PUT api/v1/users/logout
// access Private/Admin
const logoutUser = asyncErrorHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});

// @desc  Update User shipping address
// @route PUT api/v1/users//update/shipping
// access Private/Admin

const updateShippingAddressCtrl = asyncErrorHandler(async (req, res, next) => {
  const {
    firstname,
    lastname,
    address,
    city,
    postalCode,
    province,
    country,
    phone,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuth,
    {
      shippingAddress: {
        firstname,
        lastname,
        address,
        city,
        postalCode,
        province,
        country,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    },
  );

  if (!user) {
    throw next(new AppError("no Id user  for update", 404));
  }
  res.status(200).json({
    Status: "Successful",
    message: "User shipping Address updated Successfully",
    data: { user },
  });
});

export {
  registerUser,
  loginUser,
  getUserByIdCtrl,
  updateShippingAddressCtrl,
  logoutUser,
};
