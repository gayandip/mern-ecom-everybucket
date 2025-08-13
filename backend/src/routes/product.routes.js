import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/fileUploader.middleware.js";
import {
  getAllProductsFromStore,
  getCategorizedProduct,
  getProduct,
  listNewProduct,
  verifyToListProduct,
  getAllProducts,
  getNewArrivals,
  getStoreStats,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter
  .route("/add-new/:storeid")
  .post(
    verifyJWT,
    verifyToListProduct,
    upload.array("images", 3),
    listNewProduct
  );

productRouter.route("/get/all/from-store/:id").get(getAllProductsFromStore);
productRouter.route("/get/all").get(getAllProducts);
productRouter.route("/get/new-arrivals").get(getNewArrivals);
productRouter.route("/get/store-stats/:id").get(getStoreStats);
productRouter.route("/category").get(getCategorizedProduct);
productRouter.route("/get/:id").get(getProduct);

export { productRouter };
