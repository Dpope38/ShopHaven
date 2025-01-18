import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .get(isLogin, getAllCoupons)
  .post(isLogin, isAdmin, createCoupon);
couponRouter
  .route("/:id")
  .get(isLogin, getSingleCoupon)
  .put(isLogin, isAdmin, updateCoupon)
  .delete(isLogin, isAdmin, deleteCoupon);

export default couponRouter;
