const VALIDATION_MESSAGES = require("../../contants/ValidationMessages");
const { getSummary } = require("../../helper/FinanceHelper");
const OrderModel = require("../../models/OrderModel");
const PositionModel = require("../../models/PositionModel");
const UserModel = require("../../models/UserModel");
const { buildErrorMessage } = require("../../validators/BaseValidator");

const createOrder = async (req, res, next) => {
  try {
    let { symbol, price, amount, orderType, orderMarketType, isPaper } =
      req.body;
    let orderStatus = "open";
    amount = parseInt(amount);
    // minimum price increment is 1/10th of a penny
    price = parseFloat(parseInt(price * 1000) / 1000).toFixed(2);

    if (amount < 1) {
      return res.status(400).json({
        errors: [
          buildErrorMessage(VALIDATION_MESSAGES["MINIMUM"], "amount", 1),
        ],
      });
    }
    if (price < 0) {
      return res.status(400).json({
        errors: [buildErrorMessage(VALIDATION_MESSAGES["MINIMUM"], "price", 0)],
      });
    }

    const ticker = await getSummary(symbol);
    if (!ticker) {
      return res.status(400).json({
        errors: [
          buildErrorMessage(VALIDATION_MESSAGES["TICKER_NOT_FOUND"]),
          symbol,
        ],
      });
    }

    let currentUser = await UserModel.findOne({ _id: req.id });
    let currentUserStocks = currentUser.stocks;
    if (orderType == "buy" && !isPaper) {
      if (currentUser.balance < amount * price)
        return res
          .status(400)
          .json({ errors: ["not enough balance to execute this order!"] });
      else currentUser.balance -= amount * price;
    } else if (orderType == "sell") {
      for (let j = 0; j < currentUser.stocks.length; j++) {
        if (currentUser.stocks[j].symbol == ticker._id) {
          currentUserStocks.stocks[j].amount -= amount;
        }
      }
    }

    // put a hold on the users balance creating the order
    currentUser = await currentUser.save();

    // create the current users order with 'open' status
    let currentOrder = new OrderModel({
      userId: req.id,
      symbol: ticker._id,
      price,
      amount,
      orderType,
      orderMarketType,
      isPaper,
      orderStatus,
    });
    currentOrder = await currentOrder.save();

    // create the current uesrs current position with empty entries
    let currentPosition = new PositionModel({
      userId: req.id,
      orderId: currentOrder._id,
      symbol: ticker._id,
      entries: [],
    });
    currentPosition = await currentPosition.save();

    let searchOrderType = "buy";
    // if the user is buying search for matching sells
    if (orderType === "buy") {
      searchOrderType = "sell";
    }

    let baseOrderMatchingQuery = {
      symbol: ticker._id,
      orderType: searchOrderType,
      orderStatus: { $in: ["open", "partial"] },
      userId: {$ne: currentUser._id}
    };

    if (orderMarketType == "limit") {
      baseOrderMatchingQuery.price = { $lte: price };
    }

    const openOrders = await OrderModel.find(baseOrderMatchingQuery).sort(
      "price created",
    );

    let remainingAmountToPurchase = amount;
    
    
    for (let i = 0; i < openOrders.length; i++) {
      order = openOrders[i];
      const amountFromOrder = Math.min(order.amount, remainingAmountToPurchase);
      remainingAmountToPurchase -= amountFromOrder;

      if (!isPaper) {
        const fillerUser = await UserModel.findOne({ _id: order.userId });
        for (let k = 0; k < fillerUser.stocks.length; k++) {
          if (fillerUser.stocks[k].symbol == ticker._id) {
            if (orderType == "buy")
              fillerUser.stocks[k].amount -= amountFromOrder;
            else fillerUser.stocks[k].amount += amountFromOrder;
          }
        }
        // update the filler users holdings
        fillerUser.save();
        // the new position entry to add to both orders
        const newEntry = { amount: amountFromOrder, price: order.price };

        // the order that will fill this one either fully or partially
        const fillingOrderPosition = {
          userId: order.userId,
          symbol: order.symbol,
          orderId: order.orderId,
        };
        let positionFromOrder =
          await PositionModel.findOne(fillingOrderPosition);
        if (!positionFromOrder) {
          fillingOrderPosition.entries = [];
          positionFromOrder = new PositionModel(fillingOrderPosition);
        }
        positionFromOrder.entries.push(newEntry);
        currentPosition.entries.push(newEntry);

        currentPosition = await currentPosition.save();
        positionFromOrder.save();

        order.amount -= amountFromOrder;
        order.orderStatus =
          order.amount <= amountFromOrder ? "closed" : "partial";
        order.save();
      }

      if (remainingAmountToPurchase == 0) break;
    }

    
    currentOrder.amount = remainingAmountToPurchase;
    if (remainingAmountToPurchase == 0) {
      
      currentOrder.orderStatus = "closed";
    } else if (remainingAmountToPurchase < amount) {
      
      currentOrder.orderStatus = "partial";
    }

    let found = false;
    let h = 0;
    
    for (h = 0; h < currentUser.stocks.length; h++) {
      if (currentUser.stocks[h].symbol == ticker._id) {
        found = true;
        break;
      }
    }
    if (found) {
      if (orderType == "buy") {
        currentUser.stocks[h].amount +=
          currentOrder.amount - remainingAmountToPurchase;
      } else {
        currentUser.stocks[h].amount -=
          currentOrder.amount - remainingAmountToPurchase;
        currentUser.balance +=
          (currentOrder.amount - remainingAmountToPurchase) * price;
      }
    } else {
      currentUser.stocks.push({
        symbol: ticker._id,
        amount: currentOrder.amount - remainingAmountToPurchase,
      });
      if (orderType == "sell") {
        currentUser.balance +=
          (currentOrder.amount - remainingAmountToPurchase) * price;
      }
    }

    currentUser = await currentUser.save();
    currentOrder = await currentOrder.save();

    return res.status(200).json({ order: currentOrder });
  } catch (error) {
    return next(error);
  }
};

const closeOrder = async (req, res, next) => {
  try {
    let { id } = req.body;

    OrderModel.findOneAndUpdate({ _id: id }, { orderStatus: "closed" });

    return res.status(200).json({});
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  closeOrder,
};
