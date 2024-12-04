import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncExe } from "../utils/asyncExecute.js";
import { Seller } from "../models/seller.model.js";
import { User } from "../models/user.model.js";

const createStore = asyncExe(async (req, res) => {
  const { storeName, ownerName, description, phone, address } = req.body;

  if (
    [storeName, ownerName, phone, address, description].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "empty fields");
  }

  const existingStore = await Seller.findOne({ storeName });
  if (existingStore) {
    throw new ApiError(400, "store name already exist");
  }

  const store = await Seller.create({
    storeName,
    ownerName,
    user: req.user._id,
    description,
    contact: { phone, address },
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

  const store = await Seller.findById(storeID);
  if (!store) {
    throw new ApiError(500, "cannot find store");
  }

  res
    .status(200)
    .json(new ApiResponse(200, store, "store fetched successfully"));
});

export { createStore, storeDetails };
