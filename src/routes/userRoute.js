import express from "express";
import {
  registerUser,
  loginUser,
  getUserCtrl,
  updateShippingAddressCtrl,
} from "../controllers/userController.js";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", isLogin, isAdmin, getUserCtrl);
userRouter.put("/update/shipping", isLogin, isAdmin, updateShippingAddressCtrl);

export default userRouter;
