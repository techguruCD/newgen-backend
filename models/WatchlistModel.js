const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const watchListModel = new Schema({
  name: {type: String, trim: true, minLength: 1},
  userId: {type: ObjectId, ref: 'User', index: true},

  // symbols: [
  //   {type: ObjectId, ref: 'Ticker'}
  // ]
  symbols: {
    type: [String],
    default: []
  }
},
{timestamps: true});

module.exports = mongoose.model("Watchlist", watchListModel);
