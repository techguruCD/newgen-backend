const UserOrders = require("./user/UserOrders");
const UserSettings = require("./user/UserSettings");
const UserWatchlist = require("./user/UserWatchlist");
const UserPositions = require("./user/UserPositions");

// package the files to a single interface for exporting
module.exports = {
  orders: UserOrders,
  settings: UserSettings,
  watchList: UserWatchlist,
  positions: UserPositions
};
