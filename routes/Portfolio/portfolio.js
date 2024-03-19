const express = require("express");
const authenticate = require('../../middleware/Authenticate');
const {getFunds,getPortFolio,update,} = require("../../controllers/portfolio/portfolioService"); //done
var router = express.Router();

router.post("/getFund",authenticate,getFunds);
router.post("/getPortfolio",authenticate,getPortFolio);
router.post("/update", authenticate,update);

module.exports = router