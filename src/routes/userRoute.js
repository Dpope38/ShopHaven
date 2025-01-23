import express from "express";
import {
  registerUser,
  loginUser,
  getUserByIdCtrl,
  logoutUser,
  updateShippingAddressCtrl,
} from "../controllers/userController.js";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", isLogin, logoutUser);

userRouter.get("/profile/:id", isLogin, isAdmin, getUserByIdCtrl);
userRouter.put("/update/shipping", isLogin, isAdmin, updateShippingAddressCtrl);

export default userRouter;
