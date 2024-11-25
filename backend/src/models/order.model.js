import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  alternatePhone: String,
  pincode: { type: Number, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  landmark: { type: String, required: true },
  state: { type: String, required: true },
  houseNo: String,
});

const ProductSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  name: String,
  total: Number,
});

const orderSchema = new Schema(
  {
    orderID: {
      type: String,
      required: true,
      unique: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    products: [ProductSchema],
    address: addressSchema,
    paymentType: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    seller: { type: Schema.Types.ObjectId, ref: "Seller" },
    buyer: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["processing", "delivered", "cancelled"],
      default: "processing",
    },
  },

  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
