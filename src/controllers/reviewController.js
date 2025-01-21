/**
 * @desc Create a review
 * @route POST /api/v1/reviews/:productId
 * @access Admin/Private
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.productId - ID of the product to review
 * @param {Object} req.body - Request body
 * @param {string} req.body.product - Product being reviewed
 * @param {string} req.body.message - Review message
 * @param {number} req.body.rating - Rating given in the review
 * @param {Object} req.userAuth - Authenticated user object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @throws {AppError} If the product is not found or user has already reviewed the product
 */
/* eslint-disable no-unused-vars */
import Product from "../model/productModel.js";
import Review from "../model/review.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncErrorHandler.js";

/**
//  * @desc Create a review
//  * @route POST /api/v1/reviews
// @ access admin/private
 */

const createReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { product, message, rating } = req.body;

  // Check if product exists
  const productFound = await Product.findById(productId).populate("reviews");
  if (!productFound) {
    throw next(new AppError("Product not found", 404));
  }
  // Check if user has already reviewed this product
  // const existingReview = await Review.findOne({
  //   user: req.userAuth,
  //   product: productId,
  // });
  // console.log(existingReview);
  const hasReviewed = productFound.reviews.find((review) => {
    return review.user.toString() === req.userAuth.toString();
  });
  if (hasReviewed) {
    throw next(new AppError("You have already reviewed this product", 400));
  }

  // Create the review with proper references
  const review = await Review.create({
    message,
    rating,
    product: productId, // Use productId directly, not productId._id
    user: req.userAuth,
  });

  //  Push review reference to product and save
  productFound.reviews.push(review._id);
  await productFound.save();

  res.status(201).json({
    status: "success",
    message: "Review created successfully",
    data: { review },
  });
});

export { createReview };
