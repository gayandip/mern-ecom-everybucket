import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stocks: {
      type: Number,
      required: true,
    },
    images: [{ type: String, required: true }],
    priceInfo: {
      mrp: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
    },
    category: { type: String, required: true },
    otherDetails: [String],
    warranty: {
      type: String,
      default: "no warranty",
    },
  },

  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
