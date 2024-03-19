const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const orderModel = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true, index: true },
    symbol: { type: ObjectId, ref: "Ticker", required: true },
    price: Number,
    amount: Number,
    orderType: {
      type: String,
      enum: ["buy", "sell"],
    },
    orderMarketType: {
      type: String,
      enum: ["limit", "market"],
    },
    isPaperTrade: Boolean,
    orderStatus: {
      type: String,
      enum: ["open", "closed", "filled", "partial", "canceled"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderModel);
