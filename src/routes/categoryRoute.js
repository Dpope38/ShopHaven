import express from "express";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";
import categoryUpload from "../db_configs/categoryFile.js";

import {
  getAllCategories,
  createCategory,
  getSingleCategory,
  updateCategoryCtrl,
  deleteCategoryctrl,
} from "../controllers/categoryController.js";

const categoryRoutes = express.Router();

categoryRoutes.get("/", getAllCategories);
categoryRoutes.post(
  "/",
  isLogin,
  isAdmin,
  categoryUpload.single("file"),
  createCategory,
);
categoryRoutes.get("/:id", isLogin, isAdmin, getSingleCategory);
categoryRoutes.put("/:id", isLogin, isAdmin, updateCategoryCtrl);
categoryRoutes.delete("/:id", isLogin, isAdmin, deleteCategoryctrl);

export default categoryRoutes;
