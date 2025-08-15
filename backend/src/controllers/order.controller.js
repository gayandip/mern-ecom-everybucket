import { asyncExe } from "../utils/asyncExecute.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Seller } from "../models/seller.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const placeOrder = asyncExe(async (req, res) => {
  const generateOrderID = () => {
    return `EBOD${Date.now()}${Math.floor(Math.random() * 100)}`;
  };

  const product = req.body.product || {};
  const sellerID = req.body.seller;

  if (!(product.id && product.quantity)) {
    throw new ApiError(400, "product details required");
  }
  if (!sellerID) {
    throw new ApiError(400, "seller id required");
  }

  const sellerDoc = await Seller.findById(sellerID).select("user");
  if (!sellerDoc) {
    throw new ApiError(400, "seller not found");
  }
  if (sellerDoc.user.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot buy your own products");
  }

  product.id = new mongoose.Types.ObjectId(String(product.id));
  product.quantity = Number(product.quantity);

  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: product.id,
      owner: sellerID,
      stocks: { $gte: product.quantity },
    },
    {
      $inc: { stocks: -product.quantity },
    },
    { new: true }
  );
  if (!updatedProduct) {
    throw new ApiError(400, "product not available");
  }

  const productDetails = await Product.aggregate([
    {
      $match: {
        _id: product.id,
      },
    },
    {
      $addFields: {
        quantity: product.quantity,
        totalPrice: {
          $multiply: ["$priceInfo.sellingPrice", product.quantity],
        },
        otherCost: 0,
        id: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
        product: {
          id: "$id",
          quantity: "$quantity",
          name: "$name",
          price: "$priceInfo.sellingPrice",
        },
        seller: "$owner",
        price: {
          sumTotal: "$totalPrice",
          others: "$otherCost",
          grandTotal: {
            $sum: ["$totalPrice", "$otherCost"],
          },
        },
      },
    },
  ]);

  let orderdata = productDetails[0];
  orderdata.orderID = generateOrderID();
  orderdata.buyer = req.user._id;
  orderdata.address = req.user.address;

  const placedOrder = await Order.create(orderdata);

  if (!placedOrder) {
    await Product.findByIdAndUpdate(_id, {
      $inc: { stocks: product.quantity },
    });
    throw new ApiError(500, "error placing order");
  }

  res
    .status(200)
    .json(new ApiResponse(200, placedOrder, "order placed successfully"));
});

const getUserOrders = asyncExe(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, orders, "orders fetched successfully"));
});

const getStoreOrders = asyncExe(async (req, res) => {
  const id = req.params.id;
  let status = req?.query?.status;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  if (!id) {
    throw new ApiError(400, "store id required");
  }

  const store = await Seller.findOne({ _id: id, user: req.user._id });
  if (!store) {
    throw new ApiError(401, "not authorized or wrong store id");
  }

  const allowedStatuses = [
    "waiting-to-accept",
    "accepted",
    "processing",
    "processed",
    "delivered",
    "cancelled",
    "returned",
  ];
  let filter = { seller: id };
  if (allowedStatuses.includes(status)) {
    filter.status = status;
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("buyer", "name phoneNumber email");

  res
    .status(200)
    .json(
      new ApiResponse(200, { orders, total }, "orders fetched successfully")
    );
});

const acceptOrder = asyncExe(async (req, res) => {
  const sellerID = req.body.seller;
  const orderID = req.body.order.id;
  const costOrDiscount = Number(req.body.order.amount) || 0;
  if (!sellerID) {
    throw new ApiError(400, "seller ID required");
  }
  if (!orderID) {
    throw new ApiError(400, "order ID required");
  }

  const seller = await Seller.findOne({ _id: sellerID, user: req.user._id });
  if (!seller) {
    throw new ApiError(401, "not authorized or seller not found");
  }

  const order = await Order.findOneAndUpdate(
    {
      _id: orderID,
      seller: sellerID,
      status: "waiting-to-accept",
    },
    {
      $set: { status: "accepted" },
      $inc: {
        "price.others": costOrDiscount,
        "price.grandTotal": costOrDiscount,
      },
    },
    { new: true }
  );

  if (!order) {
    throw new ApiError(400, "order update or found error");
  }

  res.status(200).json(new ApiResponse(200, order, "order update success"));
});

const cancelOrder = asyncExe(async (req, res) => {
  const orderID = req.body.orderID;
  const seller = req.body.seller;
  if (!orderID) {
    throw new ApiError(400, "order ID required");
  }
  const order = await Order.findOneAndUpdate(
    {
      orderID,
      status: { $nin: ["delivered", "cancelled", "returned"] },
      $or: [{ buyer: req.user._id }, { seller }],
    },
    { $set: { status: "cancelled" } },
    { new: true }
  );
  if (!order) {
    throw new ApiError(403, "Not authorized or order cannot be cancelled");
  }

  // Add back the stock
  if (order.product?.id && order.product?.quantity) {
    await Product.findByIdAndUpdate(order.product.id, {
      $inc: { stocks: order.product.quantity },
    });
  }
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

const finalizeOrder = asyncExe(async (req, res) => {
  const orderID = req.body.orderID;
  if (!orderID) {
    throw new ApiError(400, "order ID required");
  }

  const order = await Order.findOneAndUpdate(
    {
      orderID,
      buyer: req.user._id,
      status: "accepted",
    },
    { $set: { status: "processing" } },
    { new: true }
  );
  if (!order) {
    throw new ApiError(400, "Order cannot be finalized");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, order, "Order finalized and moved to processing")
    );
});

export {
  placeOrder,
  getStoreOrders,
  getUserOrders,
  acceptOrder,
  cancelOrder,
  finalizeOrder,
};
