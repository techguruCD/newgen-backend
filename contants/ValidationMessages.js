const VALIDATION_MESSAGES = {
  // Generic validation errors
  INVALID_FIELD: '%s is invalid',
  REQUIRED_FIELD: '%s is required but missing',
  UNIQUE_FIELD: '%s is not unique',
  NOT_FOUND: '%s not found',
  MINIMUM: 'minimum value for field %s is %d',
  
  // Auth validation errors
  INVALID_PASSWORD: "password must contain 1 capital letter, 1 lowercase letter and 1 special character",

  // Token errors
  MISSING_TOKEN: 'no token provided',
  INVALID_TOKEN: 'invalid token provided',

  // Ticker errors
  TICKER_NOT_FOUND: '%s is not a valid ticker in then system',

}


module.exports = VALIDATION_MESSAGES;