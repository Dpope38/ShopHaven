import { Schema, model } from "mongoose";

// const reviewSchema = new Schema(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: ["true", "A review must belong to a user"],
//     },
//     product: {
//       type: Schema.Types.ObjectId,
//       ref: "Product",
//       required: [true, "Review the product"],
//     },
//     message: {
//       type: String,
//       require: [true, "Add a message"],
//     },
//     rating: {
//       type: Number,
//       required: [true, "please add a rating between 1 to 5"],
//       min: 1,
//       max: 5,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//   },
// );

// const Review = model("Review", reviewSchema);
// export default Review;

const reviewSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "Review message is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required from 1 to 5"],
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

const Review = model("Review", reviewSchema);

export default Review;
