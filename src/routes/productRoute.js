import express from "express";
import {
  createProducts,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../db_configs/fileFolder.js";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";

const productRouter = express.Router();
productRouter.post(
  "/",
  isLogin,
  isAdmin,
  upload.array("files"),
  createProducts,
);
productRouter.get("/", isLogin, getProducts);
productRouter
  .get("/:id", isLogin, getSingleProduct)
  .put("/:id", isLogin, isAdmin, updateProduct);

export default productRouter;
