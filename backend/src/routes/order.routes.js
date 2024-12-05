import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getPlacedOrders,
  getUserOrders,
  placeOrder,
} from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.route("/place-order").post(verifyJWT, placeOrder);
orderRouter.route("/get/user-orders?status").post(verifyJWT, getUserOrders);
orderRouter
  .route("/get/placed-orders/:id?status")
  .post(verifyJWT, getPlacedOrders);

export { orderRouter };
