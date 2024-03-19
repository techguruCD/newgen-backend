const router = require('express').Router();
const AuthRouter = require('./auth');
const UserRouter = require('./user');
const MarketRouter = require('./market');
const PortfolioRouter = require('./../routes/Portfolio/portfolio');
const portFolioStockRoute = require('./../routes/portfolioStocks');
const yFinanceRoute = require('./../routes/yFinance');

// Version the endpoints so that the service can support backwards compatability
router.use('/v1/auth', AuthRouter);
router.use('/v1/user', UserRouter);
router.use('/v1/market', MarketRouter);
router.use('/v1/portfolio', PortfolioRouter);
router.use('/v1/portfolioStocks', portFolioStockRoute);
router.use('/v1/yfinance', yFinanceRoute);

module.exports = router;