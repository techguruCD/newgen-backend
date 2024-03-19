const util = require('util');

// validate the parameter exists and has the correct type
const validateExists = (value, type) => {
  return value && (typeof value == type);
}

const buildErrorMessage = (message, ...args) => {
  return util.format(message, ...args);
}

module.exports = {
  
  validateExists,
  buildErrorMessage
}