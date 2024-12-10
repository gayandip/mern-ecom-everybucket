import mongoose, { Schema } from "mongoose";
import { addressSchema } from "./user.model.js";

const ProductSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    delivery: { type: Boolean, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderID: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      sumTotal: { type: Number, required: true },
      others: { type: Number, required: true },
      grandTotal: { type: Number, required: true },
    },
    payment: {
      status: {
        type: String,
        enum: ["Paid", "Due"],
        default: "Due",
      },
      paymentID: { type: Schema.Types.ObjectId, ref: "Payment" },
    },
    product: ProductSchema,
    address: addressSchema,
    seller: { type: Schema.Types.ObjectId, ref: "Seller" },
    buyer: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [
        "waiting-to-accept",
        "accepted",
        "processing",
        "processed",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "waiting-to-accept",
    },
  },

  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
