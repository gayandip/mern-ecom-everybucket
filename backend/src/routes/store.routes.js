import { Router } from "express";
import {
  createStore,
  getStoreStats,
  storeDetails,
} from "../controllers/store.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const storeRouter = Router();

storeRouter.route("/create").post(verifyJWT, createStore);
storeRouter.route("/get/details/:id").get(storeDetails);
storeRouter.route("/get/store-stats/:id").get(verifyJWT, getStoreStats);

export { storeRouter };
