import Coupon from "../model/couponModel.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

/* @desc Create  Coupon
 * @route POST /api/v1/coupons
 * @access Private/Admin
 */

const createCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // Check if Admin
  // Check if Coupon exist
  const couponExist = await Coupon.findOne({
    code,
  });
  if (couponExist) {
    throw new AppError("Coupon Already Exist", 404);
  }
  if (isNaN(discount)) {
    throw new AppError("Dicount Value must be a number", 404);
  }
  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuth,
  });

  res.status(201).json({
    status: "Succesful",
    data: {
      coupon,
    },
  });
});

/* @desc Get all Coupon
 * @route GET /api/v1/coupons
 * @access Private/Admin
 */
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: true,
    message: "Success",
    data: {
      coupons,
    },
  });
});

/* @desc Get Single Coupon
 * @route GET /api/v1/coupons
 * @access Private/Admin
 */
const getSingleCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.status(200).json({
    status: true,
    message: "Success",
    data: {
      coupon,
    },
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    },
  );
  res.status(201).json({
    status: true,
    message: "Coupon Updated Successfully",
    data: {
      coupon,
    },
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: true,
    message: "Coupon Deleted Successfully",
  });
});
export {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
};
