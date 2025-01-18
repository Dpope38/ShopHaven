import express from "express";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";

import {
  createBrand,
  deleteBrandctrl,
  getSingleBrand,
  getAllBrand,
  updateBrandCtrl,
} from "../controllers/brandController.js";

const brandRoutes = express.Router();

brandRoutes.post("/", isLogin, isAdmin, createBrand);
brandRoutes.get("/", isLogin, getAllBrand);
brandRoutes.get("/:id", isLogin, getSingleBrand);
brandRoutes.put("/:id", isLogin, updateBrandCtrl);
brandRoutes.delete("/:id", isLogin, isAdmin, deleteBrandctrl);

export default brandRoutes;
