const { getSummary } = require("../helper/FinanceHelper");
const UserModel = require("../models/UserModel");
const OrderModel = require("../models/OrderModel");
const PositionModel = require("../models/PositionModel");
const WatchlistModel = require("../models/WatchlistModel");
const bcrypt = require("bcrypt");

const DEFAULT_ROUNDS = 4;


// SEEED A TON OF DATA FOR TESTING
const TICKER_SEED = ["tsla", "aapl", "goog"];

const USER_SEED_DATA = [
  {
    email: "test_1@test.com",
    password: "Test123@",
    balance: 1000,
    paperBalance: 0,
    stocks: [
      {"name": "tsla", "amount": 200}
    ]
  },
  {
    email: "test_2@test.com",
    password: "Test123@",
    balance: 1000,
    paperBalance: 0,
    stocks: [
      {"name": "tsla", "amount": 200}
    ]
  },
  {
    email: "test_3@test.com",
    password: "Test123@",
    balance: 1000,
    paperBalance: 0,
    stocks: [
      {"name": "tsla", "amount": 200}
    ]
  },
  {
    email: "test_4@test.com",
    password: "Test123@",
    balance: 1000,
    paperBalance: 0,
    stocks: [
      {"name": "tsla", "amount": 200}
    ]
  },
  {
    email: "test_5@test.com",
    password: "Test123@",
    balance: 1000,
    paperBalance: 0,
    stocks: [
      {"name": "tsla", "amount": 200}
    ]
  },
  {
    email: "test_6@test.com",
    password: "Test123@",
    balance: 1000,
    paperBalance: 0,
    stocks: [
      {"name": "tsla", "amount": 200}
    ]
  },
];

const ORDER_SEED_DATA = [
  {
    email: "test_1@test.com",
    symbol: "tsla",
    orderType: "buy",
    orderMarketType: "limit",
    price: 175.0,
    amount: 100,
  },
  {
    email: "test_1@test.com",
    symbol: "aapl",
    orderType: "buy",
    orderMarketType: "limit",
    price: 100.0,
    amount: 100,
  },
  {
    email: "test_2@test.com",
    symbol: "tsla",
    orderType: "sell",
    orderMarketType: "limit",
    price: 178.0,
    amount: 100,
  },
  {
    email: "test_2@test.com",
    symbol: "tsla",
    orderType: "sell",
    orderMarketType: "limit",
    price: 178.5,
    amount: 100,
  },
];

const seedTokens = async () => {
  
  const tokenSeedMap = {};
  for (let ticker of TICKER_SEED) {
    console.log(888888888)
    let seededToken = await getSummary(ticker);
    tokenSeedMap[ticker] = seededToken._id;
  }
  
  return tokenSeedMap;
};

const seedUsers = async (tokenMap) => {
  
  const userSeedMap = {};
  for (let userRow of USER_SEED_DATA) {
    const password = await bcrypt.hash(userRow.password, DEFAULT_ROUNDS);

    try {
      let seededUser = {
        email: userRow.email,
        password: password,
        balance: userRow.balance,
        paperBalance: userRow.paperBalance,
        stocks: []
      };
      for (let stock of userRow.stocks) {
        seededUser.stocks.push({symbol: tokenMap[stock.name], amount: stock.amount})
      }
      let user = await UserModel.findOneAndUpdate({email: userRow.email}, seededUser, {upsert: true, new: true});
      userSeedMap[userRow.email] = user._id;
    } catch (_error) {
      
      continue;
    }
  }
  
  return userSeedMap;
};

const seedOrders = async (userMap, tickerMap) => {
  
  const ordedSeedList = [];
  for (let orderRow of ORDER_SEED_DATA) {
    const tickerId = tickerMap[orderRow.symbol];
    const userId = userMap[orderRow.email];
    const { orderMarketType, orderType, price, amount } = orderRow;

    try {
      let seededOrder = new OrderModel({
        userId: userId,
        symbol: tickerId,
        orderMarketType,
        orderType,
        price,
        amount,
        orderStatus: "open",
      });
      await seededOrder.save();
      ordedSeedList.push(seededOrder)
    } catch (_error) {
      
      continue;
    }
  }
  
  return ordedSeedList;
};
const seed = async () => {
  
  const seededTokensMap = await seedTokens();
  const seededUserMap = await seedUsers(seededTokensMap);
  const seededOrderMap = await seedOrders(seededUserMap, seededTokensMap);
  
};

module.exports = seed;
