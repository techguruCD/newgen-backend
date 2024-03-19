const authenticate = require('../../middleware/Authenticate');

const UserOrdersController = require('../../controllers/user').orders;

const router = require('express').Router();

router.get('/open', authenticate, UserOrdersController.getOpenOrders);
router.get('/history', authenticate, UserOrdersController.getOrderHistory);
router.get('/holdings', authenticate, UserOrdersController.getUserHoldings);

module.exports = router;