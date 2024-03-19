const OrderModel = require('../../models/OrderModel');
const UserModel = require('../../models/UserModel');

const getOpenOrders = async (req, res, next) => {
  try {
    let {lastCreatedAt, showPaperTrades} = req.query;
    
    let baseQuery = {userId: req.id, isPaperTrade: false, orderStatus: {$in: ['open', 'partial']} }
    if (!showPaperTrades || !(typeof showPaperTrades == 'boolean')) {
      showPaperTrades = false;
      delete baseQuery.isPaperTrade;
    }
    if (lastCreatedAt) {
      baseQuery.createdAt = {$lt: lastCreatedAt}
    }
    

    const orders = await OrderModel.find({userId: req.id}).limit(25).sort('-createdAt');
    
    return res.status(200).json({orders});
  } catch (error) {
    return next(error);
  }
};

const getOrderHistory = async (req, res, next) => {
  try {
    const {lastCreatedAt} = req.query;
    let query = {userId: req.id};
    if (lastCreatedAt) {
      query.createdAt = {$lt: lastCreatedAt};
    }
    const orders = await OrderModel.find(query).limit(25).sort('-createdAt');
    

    return res.status(200).json({orders});
  } catch (error) {
    return next(error);
  }
};

const getUserHoldings = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.id).populate('stocks.symbol');

    return res.status(200).json({user});
  } catch(error) {
    console.log(error)
    return next(error);
  }
}

module.exports = { getOpenOrders, getOrderHistory , getUserHoldings};
