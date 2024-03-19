const authenticate = require('../../middleware/Authenticate');

const MarketTickerController = require('../../controllers/market').ticker;

const router = require('express').Router();

router.get('/all', authenticate, MarketTickerController.getExistingTickers);
router.get('/:symbol', authenticate, MarketTickerController.getTicker);


module.exports = router;