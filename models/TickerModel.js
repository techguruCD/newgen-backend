const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tickerModel = new Schema({
  symbol: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    index: true,
    minLength: 1,
    maxLength: 6,
  },
  shortName: String,
  longName: String,
  currency: String,
  exchangeName: String,
  exchange: String,
  summary: {
    previousClose: Number,
    open: Number,
    dayLow: Number,
    dayHigh: Number,
    volume: Number,
    marketCap: Number,
    bid: Number,
    bidSize:Number,
    ask: Number,
    askSize: Number,
  }
},
{timestamps: true});

module.exports = mongoose.model("Ticker", tickerModel);
