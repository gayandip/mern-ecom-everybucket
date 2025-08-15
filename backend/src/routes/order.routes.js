import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getStoreOrders,
  getUserOrders,
  placeOrder,
  acceptOrder,
  cancelOrder,
  finalizeOrder,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.route("/place-order").post(verifyJWT, placeOrder);
orderRouter.route("/get/user-orders").get(verifyJWT, getUserOrders);
orderRouter.route("/get/store-orders/:id").get(verifyJWT, getStoreOrders);
orderRouter.route("/accept-order").post(verifyJWT, acceptOrder);
orderRouter.route("/cancel-order").post(verifyJWT, cancelOrder);
orderRouter.route("/finalize-order").post(verifyJWT, finalizeOrder);

export { orderRouter };
