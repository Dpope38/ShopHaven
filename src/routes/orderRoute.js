import express from "express";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  createOrder,
  getAllOrder,
  fetchSingleOrder,
  updateOrder,
  getSaleSums,
} from "../controllers/orderController.js";

const orderRoute = express.Router();

orderRoute
  .post("/", isLogin, isAdmin, createOrder)
  .get("/", isLogin, getAllOrder);
orderRoute.get("/:id", isLogin, fetchSingleOrder);
orderRoute.put("/update/:id", isLogin, isAdmin, updateOrder);
orderRoute.get("/sales/sum", isLogin, isAdmin, getSaleSums);

export default orderRoute;
