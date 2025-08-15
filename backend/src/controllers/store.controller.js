import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncExe } from "../utils/asyncExecute.js";
import { Seller } from "../models/seller.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const createStore = asyncExe(async (req, res) => {
  const { storeName, ownerName, description, phone, address } = req.body;

  if (
    [storeName, ownerName, phone, address, description].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "empty fields");
  }

  const existingStore = await Seller.findOne({
    $and: [{ user: req.user._id }, { storeName }],
  });
  if (existingStore) {
    throw new ApiError(400, "store name already exist");
  }

  const store = await Seller.create({
    storeName,
    ownerName,
    user: req.user._id,
    description,
    contact: { phone, address, email: req.user.email },
  });

  const createdStore = await Seller.findById(store._id);
  if (!createdStore) {
    throw new ApiError(500, "error creating store");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { stores: { name: storeName, id: createdStore._id } },
    },
    { new: true }
  ).select("-password");

  res
    .status(201)
    .json(new ApiResponse(200, user, "store successfully created"));
});

const storeDetails = asyncExe(async (req, res) => {
  const storeID = req.params.id;
  if (!storeID) {
    throw new ApiError(400, "store id required");
  }

  const store = await Seller.findById(storeID).select(
    "storeName ownerName description contact createdAt updatedAt"
  );
  if (!store) {
    throw new ApiError(500, "cannot find store");
  }

  res
    .status(200)
    .json(new ApiResponse(200, store, "store fetched successfully"));
});

const getStoreStats = asyncExe(async (req, res) => {
  const storeID = req.params.id;
  if (!storeID) {
    throw new ApiError(400, "store id required");
  }

  const store = await Seller.findById(storeID).select("user");
  if (!store) {
    throw new ApiError(404, "Store not found");
  }
  if (store.user.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Not authorized to view this store's stats");
  }

  const productsCount = await Product.countDocuments({ owner: storeID });

  let ordersCount = 0;
  let revenue = 0;
  try {
    const orders = await Order.find({
      seller: storeID,
      status: { $ne: "cancelled" },
    });
    ordersCount = orders.length;
    revenue = orders.reduce((sum, o) => sum + (o.price?.grandTotal || 0), 0);
  } catch (e) {
    // If Order model or data not available, skip
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        products: productsCount,
        orders: ordersCount,
        revenue,
      },
      "store stats fetched successfully"
    )
  );
});

export { createStore, storeDetails, getStoreStats };
