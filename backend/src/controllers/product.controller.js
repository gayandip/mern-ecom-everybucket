import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncExe } from "../utils/asyncExecute.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { Category } from "../models/category.model.js";
import { unlinkFile } from "../utils/unlinkFile.js";

const verifyToListProduct = asyncExe(async (req, res, next) => {
  if (!(req.user.stores.length > 0)) {
    throw new ApiError(400, "you dont have any store");
  }

  const storeID = req.params.storeid;
  if (!storeID) {
    throw new ApiError(400, "please provide a store ID");
  }

  const store = await Seller.findById(storeID);
  if (!store) {
    throw new ApiError(400, "no store found: enter valid ID");
  }

  if (!(store.user.toString() === req.user._id.toString())) {
    throw new ApiError(401, "you are not the owner of the store");
  }

  req.user.store = store;

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
      otherDetails,
    ].some((field) => toString(field)?.trim() === "")
  ) {
    throw new ApiError(400, "empty fields");
  }

  next();
});

const listNewProduct = asyncExe(async (req, res) => {
  const images = req.files || [];

  if (!images.length > 0) {
    throw new ApiError(400, "empty files");
  }

  const store = req.user.store;
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

  const imageUrls = images.map((file) => `/images/${file.filename}`);

  const details = otherDetails.split(",");

  const existingProduct = await Product.findOne({
    $and: [{ name }, { owner: store._id }, { category }],
  });
  if (existingProduct) {
    images.map((file) => unlinkFile(file.path));
    throw new ApiError(400, "product already exist");
  }

  const product = await Product.create({
    name,
    description,
    stocks,
    images: imageUrls,
    priceInfo: { mrp, sellingPrice },
    delivery: { option: dvOption, cost: dvCost },
    owner: store._id,
    category,
    otherDetails: details,
    warranty,
  });

  if (!product) {
    images.map((file) => unlinkFile(file.path));
    throw new ApiError(500, "error creating product");
  }

  const productCategory = await Category.create({
    name: category,
    product: product._id,
  });
  if (!productCategory) {
    await Product.findByIdAndDelete(product._id);
    images.map((file) => unlinkFile(file.path));
    throw new ApiError(500, "error creating category");
  }

  const updatedStore = await Seller.findByIdAndUpdate(
    store._id,
    { $push: { products: product._id } },
    { new: true }
  );
  if (!updatedStore) {
    await Product.findByIdAndDelete(product._id);
    images.map((file) => unlinkFile(file.path));
    throw new ApiError(500, "store update failed");
  }

  res
    .status(201)
    .json(new ApiResponse(200, updatedStore, "product listed successfully"));
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
  const category = req.query.search;
  if (!category) {
    throw new ApiError(400, "category required");
  }

  const products = await Category.find({ name: category }).populate("product");

  res
    .status(200)
    .json(new ApiResponse(200, products, "products fetched successfully"));
});

const getAllProducts = asyncExe(async (req, res) => {
  let { page = 1, limit = 8 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const total = await Product.countDocuments();
  const products = await Product.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      "products fetched successfully"
    )
  );
});

export {
  listNewProduct,
  getAllProductsFromStore,
  getProduct,
  getCategorizedProduct,
  getAllProducts,
  verifyToListProduct,
};
