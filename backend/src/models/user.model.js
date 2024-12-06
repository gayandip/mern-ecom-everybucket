import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const cardSchema = new Schema(
  {
    type: {
      type: String,
      enum: {
        values: ["debit", "credit"],
        message: "{VALUE} is not credit or debit",
      },
    },
    number: String,
    cvv: String,
    expiry: Date,
    name: String,
    issuer: String,
    serviceProvider: String,
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    pincode: String,
    landmark: String,
    state: String,
    city: String,
    street: String,
    houseNo: String,
    phone: String,
    alternatePhone: String,
    name: String,
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
    addresses: [addressSchema],
    paymentDetails: {
      cardsDetails: [cardSchema],
      upiAddresses: [String],
    },
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

export const User = mongoose.model("User", userSchema);
