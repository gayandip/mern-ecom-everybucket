import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  product: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

export const Category = mongoose.model("Category", categorySchema);
