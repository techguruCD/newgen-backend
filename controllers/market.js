const OrderController = require('./market/Order');
const TickerController = require('./market/Ticker');


module.exports = {
  orders: OrderController,
  ticker: TickerController
}