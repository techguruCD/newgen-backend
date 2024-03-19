const express = require("express");
const authenticate = require('../middleware/Authenticate');
const portfolioStocksService = require("../controllers/portfolioStocksService"); //done
var router = express.Router();

router.post('/getAll', authenticate, portfolioStocksService.getAll)
router.post('/getSellLimit', authenticate, portfolioStocksService.getSellLimit)

module.exports = router;