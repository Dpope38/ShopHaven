import express from "express";
import {
  registerUser,
  loginUser,
  getUserCtrl,
} from "../controllers/userController.js";
import isLogin from "../middleware/isLogin.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", isLogin, getUserCtrl);

export default userRouter;
