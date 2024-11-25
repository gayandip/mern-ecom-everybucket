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
    images: [String],
    priceInfo: {
      mrp: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
    },
    delivery: {
      option: {
        type: String,
        required: true,
        enum: ["available", "self-delivered"],
      },
      cost: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
    },
    category: [String],
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
