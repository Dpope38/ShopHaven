import express from "express";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  getAllColor,
  createColor,
  getSingleColor,
  updateColorCtrl,
  deleteColorctrl,
} from "../controllers/colorController.js";

const colorRoutes = express.Router();
colorRoutes.route("/").get(getAllColor).post(isLogin, isAdmin, createColor);
colorRoutes
  .route("/:id")
  .get(getSingleColor)
  .put(isLogin, isAdmin, updateColorCtrl)
  .delete(isLogin, isAdmin, deleteColorctrl);

export default colorRoutes;
