/* eslint-disable no-unused-vars */
import Category from "../model/category.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

// Fetch all categories
// eslint-disable-next-line no-unused-vars
/**
 * @function getAllCategories
 * @description Retrieves all categories from the database and sends them in the response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with the status and data containing categories.
 */
const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  // eslint-disable-next-line no-undef
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});

/**
 * @function createCategory
 * @description Creates a new category in the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with the status and data containing the created category.
 * @throws {AppError} If the category already exists.
 */
// Create all categories
const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // check if name exists
  const checkCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (checkCategory) {
    throw next(new AppError("Category already exists", 400));
  }

  // create category
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuth,
    image: req.file.path,
  });
  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: {
      category,
    },
  });
});

/**
 * @function getSingleCategory
 * @description Retrieves a single category by its ID from the database and sends it in the response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with the status and data containing the category.
 * @throws {AppError} If the category is not found.
 */
const getSingleCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  // Check if category exists
  if (!category) {
    throw next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category found",
    data: {
      category,
    },
  });
});

/**
 * @function updateCategoryCtrl
 * @description Updates an existing category in the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with the status and data containing the updated category.
 * @throws {AppError} If the category is not found.
 */

const updateCategoryCtrl = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // update category
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true },
  );
  if (!category) {
    throw next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "category Updated Successfully",
    data: {
      category,
    },
  });
});

/**
 * @function deleteCategoryctrl
 * @description Deletes a category from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with the status and message indicating the deletion.
 * @throws {AppError} If the category is not found.
 */
const deleteCategoryctrl = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw next(new AppError("Category not found", 404));
  }

  res.status(201).json({
    status: "Success",
    message: "Product deleted Successfully",
  });
});

export {
  getAllCategories,
  createCategory,
  getSingleCategory,
  updateCategoryCtrl,
  deleteCategoryctrl,
};
