import { asyncExe } from "../utils/asyncExecute.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Seller } from "../models/seller.model.js";

const placeOrder = asyncExe(async (req, res) => {
  const generateOrderID = () => {
    return `EBOD${Date.now()}${Math.floor(Math.random() * 100)}`;
  };

  const { totalPrice, paymentType, seller, address, products } = req.body.order;

  if ([totalPrice, paymentType, seller].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "proper order details required");
  }
  if (Object.keys(address).length < 7) {
    throw new ApiError(400, "proper address details required");
  }
  if (!products.length) {
    throw new ApiError(400, "minimum one product required");
  }

  const placedOrder = await Order.create({
    orderID: generateOrderID(),
    totalPrice,
    paymentType,
    seller,
    buyer: req.user._id,
    products,
    address,
  });

  if (!placedOrder) {
    throw new ApiError(500, "error placing order");
  }

  res
    .status(200)
    .json(new ApiResponse(200, placedOrder, "order placed successfully"));
});

const getUserOrders = asyncExe(async (req, res) => {
  const status = req.query.status;
  if (!status) {
    throw new ApiError(400, "status query required");
  }

  let orders;
  if (status == "all") {
    orders = await Order.find({ buyer: req.user._id });
  } else {
    orders = await Order.find({ $and: [{ buyer: req.user._id }, { status }] });
  }

  res
    .status(200)
    .json(new ApiResponse(200, orders, "orders fetched successfully"));
});

const getPlacedOrders = asyncExe(async (req, res) => {
  const id = req.params.id;
  const status = req.query.status;
  if (!id) {
    throw new ApiError(400, "store id required");
  }
  if (!status) {
    throw new ApiError(400, "status query required");
  }

  const user = await Seller.findById(id).select("user");
  if (!user) {
    throw new ApiError(400, "wrong store id");
  }

  if (!(user.user == req.user._id)) {
    throw new ApiError(401, "not authorized");
  }

  let orders;
  if (status == "all") {
    orders = await Order.find({ seller: id });
  } else {
    orders = await Order.find({ $and: [{ seller: id }, { status }] });
  }

  res
    .status(200)
    .json(new ApiResponse(200, orders, "orders fetched successfully"));
});

export { placeOrder, getPlacedOrders, getUserOrders };
