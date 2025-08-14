import mongoose, { Schema } from "mongoose";

const upiSchema = new Schema(
  {
    address: { type: String, required: true },
    bankName: { type: String, required: true },
    platform: { type: String, required: true },
    nameOnBank: { type: String, required: true },
  },
  { _id: false }
);

const cardSchema = new Schema(
  {
    type: {
      type: String,
      enum: {
        values: ["debit", "credit"],
        message: "{VALUE} is not credit or debit",
      },
      required: true,
    },
    number: { type: String, required: true },
    cvv: { type: String, required: true },
    expiry: { type: Date, required: true },
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    serviceProvider: { type: String, required: true },
  },
  { _id: false }
);

const paymentSchema = new Schema(
  {
    paymentID: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paidTo: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    details: {
      through: {
        type: String,
        required: true,
        enum: ["card", "upi"],
      },
      cardDetails: cardSchema,
      upiDetails: upiSchema,
    },
    status: {
      type: String,
      required: true,
      enum: ["success", "failed"],
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
