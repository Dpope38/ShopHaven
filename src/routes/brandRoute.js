import express from "express";
import isLogin from "../middleware/isLogin.js";

import {
  createBrand,
  deleteBrandctrl,
  getSingleBrand,
  getAllBrand,
  updateBrandCtrl,
} from "../controllers/brandController.js";

const brandRoutes = express.Router();

brandRoutes.get("/", getAllBrand);
brandRoutes.post("/", isLogin, createBrand);
brandRoutes.get("/:id", getSingleBrand);
brandRoutes.put("/:id", updateBrandCtrl);
brandRoutes.delete("/:id", deleteBrandctrl);

export default brandRoutes;
