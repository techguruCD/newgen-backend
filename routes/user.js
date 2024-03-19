const router = require('express').Router();
const UserSettings = require('./user/Settings');
const UserOrders = require('./user/Orders');
const UserPositions = require('./user/Positions');
const UserWatchlist = require('./user/Watchlist');

router.use('/settings', UserSettings);
router.use('/orders', UserOrders);
router.use('/position', UserPositions);
router.use('/watchlist', UserWatchlist);

module.exports = router;