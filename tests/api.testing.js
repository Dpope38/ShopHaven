/* eslint-disable no-undef */
/**
 * @fileoverview Tests for Product API endpoints.
 * @requires mongoose
 * @requires dotenv
 * @requires supertest
 * @requires ../src/index.js
 * @requires ../src/model/productModel.js
 * @requires ../src/model/brandModel.js
 * @requires ../src/model/category.js
 */

import mongoose from "mongoose";
import request from "supertest";
import app from "../src/index.js"; // Your Express app
import Product from "../src/model/productModel.js";
import Brand from "../src/model/brandModel.js";
import Category from "../src/model/category.js";
import dotenv from "dotenv";
dotenv.config();

describe("Product API", () => {
  /**
   * Setup before running tests.
   * Connects to a test database.
   * @async
   * @function beforeAll
   *
   */
  beforeAll(async () => {
    // ...(async () => {
    // Connect to a test database
    const mongoUri = process.env.URL;
    await mongoose.connect(mongoUri);
  });
});

/**
 * Clean up after each test.
 * Deletes all documents from Product, Brand, and Category collections.
 * @async
 * @function afterEach
 */
afterEach(async () => {
  // Clean up after each test
  await Product.deleteMany({});
  await Brand.deleteMany({});
  await Category.deleteMany({});
});

/**
 * Clean up after all tests.
 * Closes the mongoose connection.
 * @async
 * @function afterAll
 */
afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/product", () => {
  /**
   * Test product creation.
   * Should create a new product when valid data is provided.
   * @async
   * @function it
   */
  it("should create a new product when valid data is provided", async () => {
    // ...
    const brand = await Brand.create({
      name: "Test Brand",
      description: "Test Brand Description",
    });

    const category = await Category.create({
      name: "Test Category",
      description: "Test Category Description",
    });

    const productData = {
      name: "Test Product",
      description: "Test Description",
      brand: brand.name,
      category: category.name,
      sizes: ["S", "M", "L"],
      colors: ["Red", "Blue"],
      price: 99.99,
      totalQty: 100,
    };
    const response = await request(app)
      .post("/api/v1/product") // Adjust the endpoint as needed
      .send(productData);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.product.name).toBe(productData.name);
  });

  /**
   * Test product creation.
   * Should return error when product already exists.
   * @async
   * @function it
   */
  it("should return error when product already exists", async () => {
    // ...
    const brand = await Brand.create({
      name: "Test Brand",
      description: "Test Brand Description",
    });

    const category = await Category.create({
      name: "Test Category",
      description: "Test Category Description",
    });

    // Create initial product
    const productData = {
      name: "Test Product",
      description: "Test Description",
      brand: brand.name,
      category: category.name,
      sizes: ["S", "M", "L"],
      colors: ["Red", "Blue"],
      price: 99.99,
      totalQty: 100,
    };

    await Product.create(productData);

    // Try to create the same product again
    const response = await request(app)
      .post("/api/v1/product")
      .send(productData);

    expect(response.status).toBe(409);
    expect(response.body.status).toBe("error");
  });

  /**
   * Test product creation.
   * Should return error when brand does not exist.
   * @async
   * @function it
   */
  it("should return error when brand does not exist", async () => {
    // ...
    const category = await Category.create({
      name: "Test Category",
      description: "Test Category Description",
    });

    const productData = {
      name: "Test Product",
      description: "Test Description",
      brand: "Non-existent Brand",
      category: category.name,
      sizes: ["S", "M", "L"],
      colors: ["Red", "Blue"],
      price: 99.99,
      totalQty: 100,
    };

    const response = await request(app).post("/api/products").send(productData);

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("Brand does not exist");
  });

  /**
   * Test product creation.
   * Should return error when category does not exist.
   * @async
   * @function it
   */
  it("should return error when category does not exist", async () => {
    // ...
    const brand = await Brand.create({
      name: "Test Brand",
      description: "Test Brand Description",
    });

    const productData = {
      name: "Test Product",
      description: "Test Description",
      brand: brand.name,
      category: "Non-existent Category",
      sizes: ["S", "M", "L"],
      colors: ["Red", "Blue"],
      price: 99.99,
      totalQty: 100,
    };

    const response = await request(app).post("/api/products").send(productData);

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("Category does not exist");
  });
});

it("should return error when brand does not exist", async () => {
  const category = await Category.create({
    name: "Test Category",
    description: "Test Category Description",
  });

  const productData = {
    name: "Test Product",
    description: "Test Description",
    brand: "Non-existent Brand",
    category: category.name,
    sizes: ["S", "M", "L"],
    colors: ["Red", "Blue"],
    price: 99.99,
    totalQty: 100,
  };

  const response = await request(app).post("/api/products").send(productData);

  expect(response.status).toBe(404);
  expect(response.body.message).toContain("Brand does not exist");
});

it("should return error when category does not exist", async () => {
  const brand = await Brand.create({
    name: "Test Brand",
    description: "Test Brand Description",
  });

  const productData = {
    name: "Test Product",
    description: "Test Description",
    brand: brand.name,
    category: "Non-existent Category",
    sizes: ["S", "M", "L"],
    colors: ["Red", "Blue"],
    price: 99.99,
    totalQty: 100,
  };

  const response = await request(app).post("/api/v1/product").send(productData);

  expect(response.status).toBe(404);
  expect(response.body.message).toContain("Category does not exist");
});
