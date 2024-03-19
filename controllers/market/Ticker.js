const VALIDATION_MESSAGES = require("../../contants/ValidationMessages");
const { getSummary } = require("../../helper/FinanceHelper");
const TickerModel = require("../../models/TickerModel");
const { buildErrorMessage } = require("../../validators/BaseValidator");
const { ticker } = require("../market");

const getTicker = async (req, res, next) => {
  try {
    let ticker = req.params.symbol || undefined;
    
    
    if (!ticker || !(typeof ticker === "string") || ticker.length > 6) {
      return res.status(422).json({
        errors: [
          buildErrorMessage(VALIDATION_MESSAGES[INVALID_FIELD], "ticker"),
        ],
      });
    }
    const tickerData = await getSummary(ticker);
    
    if (!tickerData) {
      return res.status(400).json({
        errors: [
          buildErrorMessage(VALIDATION_MESSAGES["TICKER_NOT_FOUND"], ticker),
        ],
      });
    }
    return res.status(200).json({ ticker: tickerData });
  } catch (error) {
    return next(error);
  }
};

const getExistingTickers = async (req, res, next) => {
  try {
    const {lastSeenTicker} = req.query;
    
    let query = {};
    if (lastSeenTicker) {
      query = {symbol: {$gt: lastSeenTicker}};
    }
    
    const tickerList = await TickerModel.find(query).limit(25).sort('+symbol');
    
    return res.status(200).json({tickers: tickerList});
  } catch (error) {
    return next();
  }
};

module.exports = { getTicker, getExistingTickers };
