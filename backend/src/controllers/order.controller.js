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

  if (!(product.id && product.quantity && product.delivery)) {
    throw new ApiError(400, "product details required");
  }
  if (!sellerID) {
    throw new ApiError(400, "seller id required");
  }

  product.id = new mongoose.Types.ObjectId(product.id);
  product.quantity = Number(product.quantity);
  product.delivery = Boolean(product.delivery);

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
        otherCost: {
          $cond: {
            if: {
              $and: [
                { $eq: [product.delivery, true] },
                { $eq: ["$delivery.option", true] },
              ],
            },
            then: "$delivery.cost",
            else: 0,
          },
        },
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
          delivery: { $and: [product.delivery, "$delivery.option"] },
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

  if (orderdata.product.delivery) {
    orderdata.address = req.user.address;
  }

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
  const orders = await Order.find({ buyer: req.user._id });

  res
    .status(200)
    .json(new ApiResponse(200, orders, "orders fetched successfully"));
});

const getStoreOrders = asyncExe(async (req, res) => {
  const id = req.params.id;
  const status = req.query.status || "all";
  if (!id) {
    throw new ApiError(400, "store id required");
  }

  const user = await Seller.findById(id).select("user");
  if (!user) {
    throw new ApiError(400, "wrong store id");
  }

  if (!(user.user.toString() === req.user._id.toString())) {
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

  const user = await Seller.findById(sellerID).select("user");
  if (!user) {
    throw new ApiError(400, "seller not found");
  }
  if (!(user.user.toString() === req.user._id.toString())) {
    throw new ApiError(401, "not authorized");
  }

  const order = await Order.findOneAndUpdate(
    {
      _id: orderID,
      seller: sellerID,
      status: { $in: ["waiting-to-accept", "accepted"] },
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

export { placeOrder, getStoreOrders, getUserOrders, acceptOrder };
