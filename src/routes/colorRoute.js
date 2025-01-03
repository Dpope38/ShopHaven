import express from "express";
import {
  getAllColor,
  createColor,
  getSingleColor,
  updateColorCtrl,
  deleteColorctrl,
} from "../controllers/colorController.js";

const colorRoutes = express.Router();
colorRoutes.get("/", getAllColor);
colorRoutes.post("/", createColor);
colorRoutes.get("/:id", getSingleColor);
colorRoutes.put("/:id", updateColorCtrl);
colorRoutes.delete("/:id", deleteColorctrl);

export default colorRoutes;
