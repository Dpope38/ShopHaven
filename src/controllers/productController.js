/* eslint-disable no-unused-vars */
import Product from "../model/productModel.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

// create products
const createProducts = asyncHandler(async (req, res, next) => {
  const { name, description, brand, category, sizes, colors, price, totalQty } =
    req.body;

  const productExist = await Product.findOne({ name });
  console.log(`this is ${productExist}`);

  //CHECK IF PRODUCT already exists...

  if (productExist) {
    throw new AppError("Product already exists", 409);
  }

  // create product...

  const product = await Product.create({
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user: req.userAuth,
    price,
    totalQty,
  });

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

export { createProducts };
