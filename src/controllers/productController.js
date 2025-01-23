/**
 * Creates a new product.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing product details.
 * @param {string} req.body.name - Name of the product.
 * @param {string} req.body.description - Description of the product.
 * @param {string} req.body.brand - Brand of the product.
 * @param {string} req.body.category - Category of the product.
 * @param {Array<string>} req.body.sizes - Sizes available for the product.
 * @param {Array<string>} req.body.colors - Colors available for the product.
 * @param {number} req.body.price - Price of the product.
 * @param {number} req.body.totalQty - Total quantity of the product.
 * @param {Object} req.files - Files object containing product images.
 * @param {Object} res - Express response object.
 * @throws {AppError} If the product already exists.
 * @throws {AppError} If the brand does not exist.
 * @throws {AppError} If the category does not exist.
 * @returns {Promise<void>}
 */

/**
 * Retrieves all products with optional filters and pagination.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Query parameters for filtering and pagination.
 * @param {string} [req.query.name] - Filter by product name.
 * @param {string} [req.query.category] - Filter by product category.
 * @param {string} [req.query.brand] - Filter by product brand.
 * @param {string} [req.query.colors] - Filter by product colors.
 * @param {string} [req.query.price] - Filter by price range (e.g., "10-100").
 * @param {number} [req.query.limit=10] - Number of products per page.
 * @param {number} [req.query.page=1] - Page number.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */

/**
 * Retrieves a single product by ID.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - ID of the product to retrieve.
 * @param {Object} res - Express response object.
 * @throws {AppError} If the product is not found.
 * @returns {Promise<void>}
 */

/**
 * Updates an existing product by ID.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - ID of the product to update.
 * @param {Object} req.body - Request body containing updated product details.
 * @param {string} [req.body.name] - Updated name of the product.
 * @param {string} [req.body.description] - Updated description of the product.
 * @param {string} [req.body.brand] - Updated brand of the product.
 * @param {string} [req.body.category] - Updated category of the product.
 * @param {Array<string>} [req.body.sizes] - Updated sizes available for the product.
 * @param {Array<string>} [req.body.colors] - Updated colors available for the product.
 * @param {number} [req.body.price] - Updated price of the product.
 * @param {number} [req.body.totalQty] - Updated total quantity of the product.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
/* eslint-disable no-unused-vars */
import Product from "../model/productModel.js";
import Brand from "../model/brandModel.js";
import Category from "../model/category.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

// create products
const createProducts = asyncHandler(async (req, res, next) => {
  // Get image from client
  const convertedImgs = req.files.map((file) => file.path);
  const { name, description, brand, category, sizes, colors, price, totalQty } =
    req.body;

  const productExist = await Product.findOne({ name });

  //CHECK IF PRODUCT already exists...

  if (productExist) {
    throw next(new AppError("Product already exists", 409));
  }

  // Check if no brand
  const brandChecked = await Brand.findOne({
    name: { $regex: new RegExp(`^${brand}$`, "i") },
  });

  if (!brandChecked) {
    throw new AppError("Brand does not exist, provide Brand", 404);
  }
  // check if category exists
  const checkCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${category}$`, "i") },
  });
  if (!checkCategory) {
    throw next(new AppError("Category does not exist, provide category", 404));
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
    image: convertedImgs,
  });
  // Push the category to the product
  checkCategory.products.push(product);
  await checkCategory.save();

  // Push the Brand to the product
  brandChecked.products.push(product);
  await brandChecked.save();

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: {
      product,
    },
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

  const allProducts = await products.populate("reviews");

  res.status(200).json({
    status: "success",
    data: {
      results: allProducts.length,
      total,
      pagination,
      allProducts,
    },
  });
});

// Get single product
const getSingleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("reviews");

  if (!product) {
    throw next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
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
    data: {
      product,
    },
  });
});
export { createProducts, getProducts, getSingleProduct, updateProduct };
