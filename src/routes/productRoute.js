import express from "express";
import {
  createProducts,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import isLogin from "../middleware/isLogin.js";

const productRouter = express.Router();

// productRouter.get("/", getProducts);
productRouter.post("/", isLogin, createProducts).get("/", getProducts);
productRouter.get("/:id", getSingleProduct).put("/:id", isLogin, updateProduct);

export default productRouter;
