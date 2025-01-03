// import Review from "../model/review.js";
// import Product from "../model/productModel.js";

// /**
// * @desc Create a review
//  * @route POST /api/v1/reviews
//  @ access admin/private
//  */

// const createReview = async (req, res) => {
//   const { rating, message } = req.body;
//   const { productId } = req.params;

//   const productFound = await Product.findById(productId).populate("reviews");
//   if (!productFound) {
//     // throw new Error("Product not found.");
//     return res.status(404).json({
//         message:
//     })
//   }

//   /* check for an existing user...
//    And also avoid duplication of same user reviewing more than once*/

//   const hasReviewed = productFound.reviews.find((review) => {
//     return "found";//review.user.toString() === req.userAuthId.toString();
//   });
//   if (hasReviewed) {
//     return res.status(400).json({ message: "You have already reviewed this product" });
//   }
//    const review = await Review.create({
//     message,
//     rating,
//     product: productFound._id,
//     user,
//   });
// };
