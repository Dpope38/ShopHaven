/* eslint-disable no-unused-vars */
import Category from "../model/category.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

// Fetch all categories
// eslint-disable-next-line no-unused-vars
const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  // eslint-disable-next-line no-undef
  console.log(process.env);
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
  console.log(checkCategory);

  if (checkCategory) {
    const err = new AppError("Category already exists", 400);
    return next(err);
  }

  // create category
  const category = await Category.create({
    name: name.toLowerCase(),
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
const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  // Check if category exists
  if (!category) {
    const err = new AppError("Category not found", 404);
    return next(err);
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
    const err = new AppError("Category not found", 404);
    return next(err);
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
    const err = new AppError("Category not found", 404);
    return next(err);
  }

  res.status(201).json({
    status: "Success",
    message: "Product deleted Successfully",
  });
});

export {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategoryCtrl,
  deleteCategoryctrl,
};
