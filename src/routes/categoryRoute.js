import express from "express";

import {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategoryCtrl,
  deleteCategoryctrl,
} from "../controllers/categoryController.js";

const categoryRoutes = express.Router();

categoryRoutes.get("/", getAllCategories);
categoryRoutes.post("/", createCategory);
categoryRoutes.get("/:id", getCategory);
categoryRoutes.put("/:id", updateCategoryCtrl);
categoryRoutes.delete("/:id", deleteCategoryctrl);

export default categoryRoutes;
