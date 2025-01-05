import express from "express";
import isLogin from "../middleware/isLogin.js";
import {
  getAllColor,
  createColor,
  getSingleColor,
  updateColorCtrl,
  deleteColorctrl,
} from "../controllers/colorController.js";

const colorRoutes = express.Router();
colorRoutes.get("/", getAllColor);
colorRoutes.post("/", isLogin, createColor);
colorRoutes.get("/:id", getSingleColor);
colorRoutes.put("/:id", updateColorCtrl);
colorRoutes.delete("/:id", deleteColorctrl);

export default colorRoutes;
