import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide product-name"],
    },
    description: {
      type: String,
      required: [true, "please provide product description"],
    },
    brand: {
      type: String,
      required: [true, "please provide product brand"],
    },
    category: {
      type: String,
      required: [true, "please provide product category"],
    },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: [true, "please provide product size"],
    },
    colors: {
      type: [String],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Kindly provide user"],
    },
    image: [
      {
        type: String,
        required: [true, "please provide product image"],
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      required: [true, "provide product price"],
    },
    totalQty: {
      type: Number,
      required: [true, "provide total-quality"],
    },
    totalSold: {
      type: Number,
      required: [true, "provide total-sold "],
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

// Virtual for Total Review;

productSchema.virtual("qtyLeft").get(function () {
  const product = this;
  return product.totalQty - product.totalSold;
});

productSchema.virtual("totalReviews").get(function () {
  const product = this;
  return product.reviews.length;
});

//Virtual for Average Rating
productSchema.virtual("averageRating").get(function () {
  let ratingsTotal = 0;

  const product = this;

  product.reviews.forEach((review) => {
    ratingsTotal += review.rating;
  });

  // Calc Average rating
  const averageRating = Number(ratingsTotal / product.reviews.length).toFixed(
    1,
  );
  return averageRating;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
