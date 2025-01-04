/* eslint-disable no-unused-vars */
import Product from "../model/productModel.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

// create products
const createProducts = asyncHandler(async (req, res, next) => {
  const { name, description, brand, category, sizes, colors, price, totalQty } =
    req.body;

  const productExist = await Product.findOne({ name });

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
    user: req.userAuth.id,
    price,
    totalQty,
  });

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

// Get all products
const getProducts = asyncHandler(async (req, res, next) => {
  const products = Product.find();
  // filter by name
  if (req.query.name) {
    products.find({ name: { $regex: req.query.name, $options: "i" } });
  }
  // filter by category
  if (req.query.category) {
    products.find({ category: { $regex: req.query.category, $options: "i" } });
  }

  // filter by brand
  if (req.query.brand) {
    products.find({ brand: { $regex: req.query.brand, $options: "i" } });
  }

  // filter by color
  if (req.query.colors) {
    products.find({ colors: { $regex: req.query.colors, $options: "i" } });
  }

  // filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    products.find({ price: { $gte: priceRange[0], $lte: priceRange[1] } });
  }

  // Pagination
  // Paginate by limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // Paginate by page
  const page = parseInt(req.query.page, 10) ? parseInt(req.query.page, 10) : 1;
  // start index
  const startIndex = (page - 1) * limit;
  // end index
  const endIndex = page * limit;
  // total documents
  const total = await Product.countDocuments();
  // limit and skip
  products.limit(limit).skip(startIndex);
  // pagination result
  const pagination = {};
  // next page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  // previous page
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const allProducts = await products;

  res.status(200).json({
    status: "success",
    results: allProducts.length,
    total,
    pagination,
    allProducts,
  });
});

// Get single product
const getSingleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    status: "success",
    product,
  });
});

// Update Product
const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, brand, category, sizes, colors, price, totalQty } =
    req.body;
  // Update product
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      price,
      totalQty,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});
export { createProducts, getProducts, getSingleProduct, updateProduct };
