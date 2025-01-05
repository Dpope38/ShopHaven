/* eslint-disable no-unused-vars */
import Brand from "../model/brandModel.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncErrorHandler.js";

/*
  @desc get all Brand
  @route GET /api/v1/brand
  @access private/admin
 */

const getAllBrand = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find();

  res.status(200).json({
    length: brands.length,
    status: "Success",
    message: "brands fetched successfully",
    data: { brands },
  });
});

/*
  @desc Creates a brand
  @route POST /api/v1/brand
  @access private/admin
 */

const createBrand = asyncHandler(async (req, res, next) => {
  // check if name exist...
  const { name } = req.body;

  //   Find and Check if brand exists
  const brandChecked = await Brand.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  if (brandChecked) {
    throw new AppError("Brand already exists", 400);
  }

  // Create brand

  const creatBrand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "Success",
    message: "Brand created successfully",
    data: { creatBrand },
  });
});

/*
  @desc get a single  brand
  @route GET /api/v1/brands/:id
  @access private/admin
 */

const getSingleBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw AppError("No Id for this brand found", 404);
  }
  res.status(200).json({
    status: "success",
    message: "brand fetched successfully",
    data: { brand },
  });
});

/*
  @desc update   brand
  @route PUT /api/v1/brand/:id
  @access private/admin
 */

const updateBrandCtrl = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // update brand
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true },
  );

  if (!brand) {
    throw new AppError("Could not Found and update Brand!", 404);
  }

  res.status(200).json({
    status: "Success",
    message: "Brand Updated Successfully",
    data: { brand },
  });
});

const deleteBrandctrl = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    throw new AppError("Could not found and delete Brand", 400);
  }
  res.status(201).json({
    status: "Success",
    message: "Product deleted Successfully",
  });
});

export {
  getAllBrand,
  createBrand,
  getSingleBrand,
  updateBrandCtrl,
  deleteBrandctrl,
};
