const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userModel = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
      minLength: 6,
      maxLength: 255,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: String,
    status: {
      type: String,
      enum: ["active", "pending", "deleted"],
      default: "active",
    },
    balance: Number,
    paperBalance: Number,
    stocks: [{ symbol: { type: ObjectId, ref: "Ticker" }, amount: Number}],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userModel);
