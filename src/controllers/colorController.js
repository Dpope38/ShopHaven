/**
 * @desc Get all Colors
 * @route GET /api/v1/Color
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */

/**
 * @desc Create a Color
 * @route POST /api/v1/Color
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */

/**
 * @desc Get a single Color
 * @route GET /api/v1/color/:id
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */

/**
 * @desc Update a Color
 * @route PUT /api/v1/Color/:id
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */

/**
 * @desc Delete a Color
 * @route DELETE /api/v1/Color/:id
 * @access Private/Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
import mongoose from "mongoose";
import Color from "../model/color.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

/*
  @desc get all Color
  @route GET /api/v1/Color
  @access private/admin
 */

const getAllColor = asyncErrorHandler(async (req, res) => {
  const color = await Color.find();

  res.status(200).json({
    length: color.length,
    status: "Success",
    message: "color fetched successfully",
    data: { color },
  });
});

const createColor = asyncErrorHandler(async (req, res) => {
  // check if name exist...
  const { name } = req.body;
  const checkedColor = await Color.findOne({ name });

  if (checkedColor) {
    throw new AppError("Color already exists", 400);
  }
  const createColor = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "Success",
    message: "color created successfully",
    data: {
      createColor,
    },
  });
});

const getSingleColor = asyncErrorHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);

  if (!Color) {
    throw new AppError("Color ID not found", 404);
  }
  res.status(200).json({
    status: "success",
    message: "color fetched successfully",
    data: { color },
  });
});

const updateColorCtrl = asyncErrorHandler(async (req, res) => {
  const { name } = req.body;

  // check if the id object format is correct (optional)
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid ID! Provide a valid ID", 400);
  }
  // update brand
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true },
  );

  if (!Color) {
    throw new AppError("Could not Found and update Color!", 404);
  }

  res.status(200).json({
    status: "Success",
    message: "color Updated Successfully",
    data: { color },
  });
});

const deleteColorctrl = asyncErrorHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);

  if (!color) {
    throw new AppError("Could not found and delete Color", 400);
  }
  res.status(200).json({
    status: "Success",
    message: "Color deleted Successfully",
  });
});
export {
  getAllColor,
  createColor,
  getSingleColor,
  updateColorCtrl,
  deleteColorctrl,
};
