/* eslint-disable no-unused-vars */
import Category from "../model/category.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

// Fetch all categories
// eslint-disable-next-line no-unused-vars
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

// Create all categories
const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // check if name exists
  const checkCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (checkCategory) {
    throw new AppError("Category already exists", 400);
  }

  // create category
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuth.id,
  });
  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: {
      category,
    },
  });
});

// Fetch single category
const getSingleCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  // Check if category exists
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Category found",
    data: {
      category,
    },
  });
});

// Update category
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
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    status: "Success",
    message: "category Updated Successfully",
    data: {
      category,
    },
  });
});

// Delete category
const deleteCategoryctrl = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new AppError("Category not found", 404);
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
