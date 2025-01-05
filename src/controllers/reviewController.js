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

const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { product, message, rating } = req.body;

  // Check if product exists
  const productFound = await Product.findById(productId).populate("reviews");
  if (!productFound) {
    throw new AppError("Product not found", 404);
  }
  // Check if user has already reviewed this product
  // const existingReview = await Review.findOne({
  //   user: req.userAuth,
  //   product: productId,
  // });
  // console.log(existingReview);
  const hasReviewed = productFound.reviews.find((review) => {
    console.log(review);
    return review.user.toString() === req.userAuth.toString();
  });
  console.log(hasReviewed);
  if (hasReviewed) {
    throw new AppError("You have already reviewed this product", 400);
  }

  // Create the review with proper references
  const review = await Review.create({
    message,
    rating,
    product: productId, // Use productId directly, not productId._id
    user: req.userAuth,
  });

  // // Push review reference to product and save
  productFound.reviews.push(review._id);
  await productFound.save();

  res.status(201).json({
    status: "success",
    message: "Review created successfully",
    data: review,
  });
});

export { createReview };
