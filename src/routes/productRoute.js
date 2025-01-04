import express from "express";
import {
  createProducts,
  getProducts,
} from "../controllers/productController.js";
import isLogin from "../middleware/isLogin.js";

const productRouter = express.Router();

// productRouter.get("/", getProducts);
productRouter.post("/", isLogin, createProducts).get("/", getProducts);

export default productRouter;
