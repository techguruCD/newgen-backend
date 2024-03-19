const VALIDATION_MESSAGES = require("../contants/ValidationMessages");
const { validateExists, buildErrorMessage } = require("./BaseValidator");

const validateCreateOrderRequest = async (req, res, next) => {
  let { symbol, price, amount, orderType, orderMarketType, isPaper } =
    req.body;
  const errors = [];
  // price = parseFloat(price);
  // amount = parseFloat(amount);
  
  if (!validateExists(price, "number") ) {
    errors.push(buildErrorMessage(VALIDATION_MESSAGES["INVALID_FIELD"], "price"));
  }

  if (!validateExists(symbol, "string")) {
    errors.push(
      buildErrorMessage(VALIDATION_MESSAGES["INVALID_FIELD"], "symbol"),
    );
  }

  if (!validateExists(amount, "number")) {
    errors.push(
      buildErrorMessage(VALIDATION_MESSAGES["INVALID_FIELD"], "amount"),
    );
  }

  if (!validateExists(orderType, "string") || !['buy', 'sell'].includes(orderType)) {
    errors.push(
      buildErrorMessage(VALIDATION_MESSAGES["INVALID_FIELD"], "orderType"),
    );
  }

  if (!validateExists(orderMarketType, "string") || !['limit', 'market'].includes(orderMarketType)) {
    errors.push(
      buildErrorMessage(VALIDATION_MESSAGES["INVALID_FIELD"], "orderMarketType"),
    );
  }

  if(!validateExists(isPaper, "boolean")) {
    req.body.isPaper = false;
  }

  if (errors.length > 0) {
    req.errors.status = 422;
    req.errors.messages.push(...errors);
    return next('ValidationException');
  }

  return next();
};

module.exports = {validateCreateOrderRequest}