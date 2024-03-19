const VALIDATION_MESSAGES = require("../../contants/ValidationMessages");
const TickerModel = require("../../models/TickerModel");
const WatchlistModel = require("../../models/WatchlistModel");
const { buildErrorMessage } = require("../../validators/BaseValidator");

const createWatchlist = async (req, res, next) => {
  try {
    const {name} = req.body;

    let watchList = new WatchlistModel({userId: req.id, name: name});
    watchList = await watchList.save();

    return res.status(200).json({watchList});
  } catch (error) {
    return next(error);
  }
};

const getWatchList = async (req, res, next) => {
  try {
    let {lastCreatedAt} = req.query
    const query = {userId: req.id};
    if (lastCreatedAt) {
      query.createdAt = {$lt: lastCreatedAt}
    }
    

    const watchLists = await WatchlistModel.find(query).limit(25).sort("createdAt").populate("symbols");
    
    return res.status(200).json({watchLists})

  }
  catch (error) {
    return next(error)
  }
}
const deleteWatchList = async (req, res, next) => {
  try {
    const {name} = req.body;

    WatchlistModel.deleteOne({name: name, userId: req.id});

    return res.status(200).json({});
  } catch (error) {
    return next(error);
  }
};

const addTickerToWatchList = async (req, res, next) => {
  try {
    const {name, symbol} = req.body;

    
    const ticker = await TickerModel.findOne({symbol: symbol});
    if (!ticker) {
      return res.status(400).json({errors: [buildErrorMessage(VALIDATION_MESSAGES["TICKER_NOT_FOUND"], symbol)]});
    }

    let watchList = await WatchlistModel.findOne({name: name, userId: req.id});
    if (!watchList) {
      watchList = new WatchlistModel({name: name, userId: req.id, symbols: []});
    }
    if (!watchList.symbols.includes(ticker._id)) {
      watchList.symbols.push(ticker._id)
      watchList = watchList.save();
    }

    return res.status(200).json({watchList});
  } catch (error) {
    return next(error);
  }
};

const removeTickerFromWatchList = async (req, res, next) => {
  try {
    const {name, symbol} = req.body;
    
    const ticker = await TickerModel.findOne({symbol: symbol});
    if (!ticker) {
      return res.status(400).json({errors: [buildErrorMessage(VALIDATION_MESSAGES["TICKER_NOT_FOUND"], symbol)]});
    }
    // 
    
    let watchList = await WatchlistModel.findOne({name: name, userId: req.id});
    // 
    if (watchList && watchList.symbols.includes(ticker._id)) {
      
      const newList = watchList.symbols.filter(value => !value.equals(ticker._id))
      watchList.symbols = newList;
      watchList = watchList.save();
    }

    return res.status(200).json({watchList});
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createWatchlist,
  deleteWatchList,
  addTickerToWatchList,
  removeTickerFromWatchList,
  getWatchList
};
