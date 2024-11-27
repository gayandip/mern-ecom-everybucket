import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncExe } from "../utils/asyncExecute.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncExe(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    const userInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(userInfo.id).select("-password");
    if (!user) {
      throw new ApiError(401, "invalid access token");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, err.message || "invalid request");
  }
});
