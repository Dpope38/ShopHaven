import mongoose from "mongoose";
import dotenv from "dotenv";
import request from "supertest";
import app from "../src/index.js"; // Your Express app
import Product from "../src/model/productModel.js";
import Brand from "../src/model/brandModel.js";
import Category from "../src/model/category.js";

/* eslint-disable no-undef */
dotenv.config();

describe("Product API", () => {
  // Setup before running tests
  beforeAll(async () => {
    // Connect to a test database
    const mongoUri = process.env.URL;
    await mongoose.connect(mongoUri);
  });

  // Clean up after each test
  afterEach(async () => {
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});
  });

  // Clean up after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test product creation
  describe("POST /api/v1/product", () => {
    it("should create a new product when valid data is provided", async () => {
      // First create a brand and category
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

    it("should return error when product already exists", async () => {
      // Create initial brand and category
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
        .post("/api/v1/products") // Adjust the endpoint as needed
        .send(productData);

      expect(response.status).toBe(409);
      expect(response.body.status).toBe("error");
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

      const response = await request(app)
        .post("/api/products")
        .send(productData);

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

      const response = await request(app)
        .post("/api/v1/product")
        .send(productData);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("Category does not exist");
    });
  });
});
