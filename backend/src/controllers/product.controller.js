import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncExe } from "../utils/asyncExecute.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { Category } from "../models/category.model.js";
import { unlinkFile } from "../utils/unlinkFile.js";

const listNewProduct = asyncExe(async (req, res) => {
  const imgUrls = req.files?.images;
  if (!imgUrls.length > 0) {
    throw new ApiError(400, "empty files");
  }

  if (!(req.user.stores.length > 0)) {
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(400, "you dont have any store");
  }

  const storeID = req.params.storeid;
  if (!storeID) {
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(400, "please provide a store ID");
  }

  const store = await Seller.findById(storeID);
  if (!store) {
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(400, "no store found: enter valid ID");
  }

  if (!(store.user == req.user._id)) {
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(401, "you are not the owner of the store");
  }

  const {
    name,
    description,
    stocks,
    mrp,
    sellingPrice,
    dvOption,
    dvCost,
    category,
    otherDetails,
    warranty,
  } = req.body;

  if (
    [
      name,
      description,
      stocks,
      mrp,
      sellingPrice,
      dvOption,
      dvCost,
      category,
      warranty,
    ].some((field) => toString(field)?.trim() === "")
  ) {
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(400, "empty fields");
  }

  if (otherDetails.length == 0) {
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(400, "empty fields");
  }

  const imageUrls = imgUrls.map((file) => file.path);

  const product = await Product.create({
    name,
    description,
    stocks,
    images: imageUrls,
    priceInfo: { mrp, sellingPrice },
    delivery: { Option: dvOption, cost: dvCost },
    owner: store._id,
    category,
    otherDetails,
    warranty,
  });

  if (!product) {
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(500, "error creating product");
  }

  const productCategory = await Category.create({
    name: category,
    product: product._id,
  });
  if (!productCategory) {
    await Product.findByIdAndDelete(product._id);
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(500, "error creating category");
  }

  const updatedStore = await Seller.findByIdAndUpdate(
    store._id,
    { $push: { products: product._id } },
    { new: true }
  );
  if (!updatedStore) {
    await Product.findByIdAndDelete(product._id);
    imgUrls.map((file) => unlinkFile(file.path));
    throw new ApiError(500, "store update failed");
  }

  res.status(201).json(200, updatedStore, "product listed successfully");
});

const getAllProductsFromStore = asyncExe(async (req, res) => {
  const storeID = req.params.id;
  if (!storeID) {
    throw new ApiError(400, "store id required");
  }

  const products = await Product.find({ owner: storeID });

  res
    .status(200)
    .json(new ApiResponse(200, products, "products fetched successfully"));
});

const getProduct = asyncExe(async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    throw new ApiError(400, "product id required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(400, "no product found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "product fetched successfully"));
});

const getCategorizedProduct = asyncExe(async (req, res) => {
  const category = req.params.category;
  if (!category) {
    throw new ApiError(400, "category required");
  }

  const products = await Category.find({ name: category }).populate("product");

  res
    .status(200)
    .json(new ApiResponse(200, products, "products fetched successfully"));
});

export {
  listNewProduct,
  getAllProductsFromStore,
  getProduct,
  getCategorizedProduct,
};
