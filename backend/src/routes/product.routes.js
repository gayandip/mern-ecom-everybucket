import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/fileUploader.middleware.js";
import {
  getAllProductsFromStore,
  getCategorizedProduct,
  getProduct,
  listNewProduct,
  verifyToListProduct,
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
productRouter.route("/get/:id").get(getProduct);
productRouter.route("/category").get(getCategorizedProduct);

export { productRouter };
