const authenticate = require('../../middleware/Authenticate');
const { validateCreateOrderRequest } = require('../../validators/MarketOrderValidator');

const MarketOrderController = require('../../controllers/market').orders;

const router = require('express').Router();

router.post('/create', authenticate, validateCreateOrderRequest, MarketOrderController.createOrder);
router.post('/close', authenticate, MarketOrderController.closeOrder);

module.exports = router;