const TickerRouter = require('./market/Ticker');
const OrderRouter = require('./market/Order');

const router = require('express').Router();

router.use('/order', OrderRouter);
router.use('/ticker', TickerRouter);

module.exports = router;