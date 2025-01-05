import express from "express";
import isLogin from "../middleware/isLogin.js";
import { createReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/:productId", isLogin, createReview);

export default reviewRouter;
