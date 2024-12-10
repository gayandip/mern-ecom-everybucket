import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getStoreOrders,
  getUserOrders,
  placeOrder,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.route("/place-order").post(verifyJWT, placeOrder);
orderRouter.route("/get/user-orders").get(verifyJWT, getUserOrders);
orderRouter.route("/get/store-orders/:id").get(verifyJWT, getStoreOrders);

export { orderRouter };
