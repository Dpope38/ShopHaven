import express from "express";
import isLogin from "../middleware/isLogin.js";

import {
  getAllCategories,
  createCategory,
  getSingleCategory,
  updateCategoryCtrl,
  deleteCategoryctrl,
} from "../controllers/categoryController.js";

const categoryRoutes = express.Router();

categoryRoutes.get("/", getAllCategories);
categoryRoutes.post("/", isLogin, createCategory);
categoryRoutes.get("/:id", getSingleCategory);
categoryRoutes.put("/:id", updateCategoryCtrl);
categoryRoutes.delete("/:id", deleteCategoryctrl);

export default categoryRoutes;
