const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const positionModel = new Schema(
  {
    userId: { type: ObjectId, ref: "User" },
    symbol: { type: ObjectId, ref: "Ticker" },
    orderId: { type: ObjectId, ref: "Order" },
    entries: [
      {
        price: Number,
        amount: Number,
      },
    ],
    positionType: {
      type: String,
      enum: ["buy", "see"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Position", positionModel);
