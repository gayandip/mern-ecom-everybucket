import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
  {
    storeName: {
      type: String,
      unique: true,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    contact: {
      phone: [String],
      whatsApp: [String],
      address: {
        type: String,
        required: true,
      },
    },
  },

  {
    timestamps: true,
  }
);

export const Seller = mongoose.model("Seller", sellerSchema);
