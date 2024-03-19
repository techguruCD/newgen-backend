const express = require("express");
const authenticate = require('../middleware/Authenticate');
const yFinService = require("../controllers/yFinancialServices"); //done
var router = express.Router();

router.post("/getHistory/:symbl", yFinService.getHistory);
router.post("/getFundamentals/:symbl", yFinService.getFundamentals);

module.exports = router;