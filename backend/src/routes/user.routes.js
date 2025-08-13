import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateAddress,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/get/loggedin-user").get(verifyJWT, getCurrentUser);
userRouter.route("/update/address").put(verifyJWT, updateAddress);

export { userRouter };
