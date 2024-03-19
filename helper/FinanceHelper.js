const TickerModel = require("../models/TickerModel");
const yahooFinance = require("yahoo-finance2").default;

const fetchSummary = async (ticker) => {
  console.log('ticker', ticker)
  let rawYahooData = null;
  try {
    console.log('fetching')
    rawYahooData = await yahooFinance.quoteSummary(ticker.toUpperCase()/*'AAPL'*/, {
      modules: ["price", "summaryDetail"],
    });
  } catch(err) {
    console.log(err)
    throw(err)
  }

  console.log(123123123123123)
  console.log(rawYahooData)

  // 
  const { price, summaryDetail } = rawYahooData;

  const data = {
    symbol: price["symbol"],
    shortName: price["shortName"],
    longName: price["longName"],
    currency: price["currency"],
    exchangeName: price["exchangeName"],
    exchange: price["exchange"],
    summary: {
      previousClose: summaryDetail["regularMarketPreviousClose"],
      open: summaryDetail["open"],
      dayLow: summaryDetail["dayLow"],
      dayHigh: summaryDetail["dayHigh"],
      volume: price["regularMarketVolume"],
      marketCap: price["marketCap"],
      bid: summaryDetail['bid'] || 0,
      ask: summaryDetail['ask'] || 0,
      bidSize: summaryDetail['bidSize'] || 0,
      askSize: summaryDetail['askSize'] || 0
    },
  };

  
  return data;
};

const getSummary = async (symbol) => {
  let persistentSymbol = undefined;
  try {
    if (symbol && typeof symbol == "string") {
      
      let persistentSymbol = await TickerModel.findOne({
        symbol: symbol,
      });

      // We need to update the record because it is older than 15 seconds or it doesnt exist
      if (
        !persistentSymbol ||
        persistentSymbol.updatedAt.getMilliseconds() < Date.now() + 15000
      ) {
        const symbolDetails = await fetchSummary(symbol);
        
        persistentSymbol = await TickerModel.findOneAndUpdate(
          { symbol: symbol },
          symbolDetails,
          { upsert: true, new: true },
        );
        
        
        return persistentSymbol;
      }
    }
  } catch (error) {
    console.log(error)
  }
  return persistentSymbol;
};

module.exports = { getSummary };
