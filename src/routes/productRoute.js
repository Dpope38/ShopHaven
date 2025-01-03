import express from "express";
import { createProducts } from "../controllers/productController.js";
import isLogin from "../middleware/isLogin.js";

const productRouter = express.Router();

// productRouter.get("/", getProducts);
productRouter.post("/", isLogin, createProducts);

export default productRouter;
