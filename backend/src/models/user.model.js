import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const addressSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: Number, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, required: true },
    state: { type: String, required: true },
  },
  { _id: false }
);

const store = new Schema(
  {
    name: { type: String, required: true },
    id: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password required"],
    },
    address: addressSchema,
    stores: [store],
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);

export { User, addressSchema };
