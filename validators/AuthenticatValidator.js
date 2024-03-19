const UserModel = require('../models/UserModel');
const VALIDATION_MESSAGES = require("../contants/ValidationMessages");
const { validateExists, buildErrorMessage } = require("./BaseValidator");

const baseAuthValidator = (email, password) => {
  const errors = [];
  if (!validateExists(email, 'string')) {
    errors.push(buildErrorMessage(VALIDATION_MESSAGES['INVALID_FIELD'], 'email'));
  }

  if (!validateExists(password, 'string')) {
    errors.push(buildErrorMessage(VALIDATION_MESSAGES['INVALID_FIELD'], 'password'));
  }

  if (!(/^(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password))) {
    errors.push(VALIDATION_MESSAGES['INVALID_PASSWORD']);
  }

  return errors;
}

const validateRegisterRequest = async (req, res, next) => {
  const {email, password} = req.body;
  const errors = baseAuthValidator(email, password);


  if ((await UserModel.where({'email': email}).count()) > 0) {
    errors.push(buildErrorMessage(VALIDATION_MESSAGES['UNIQUE_FIELD'], 'email'));
  }

  if (errors.length > 0) {
    req.errors.status = 422;
    req.errors.messages.push(...errors);
    return next('ValidationException');
  }

  return next();
}

const validateLoginRequest = async (req, res, next) => {
  const {email, password} = req.body;
  

  const errors = baseAuthValidator(email, password);

  if (errors.length > 0) {
    req.errors.status = 422;
    req.errors.messages.push(...errors);
    return next('ValidationException');
  }

  return next();
}

module.exports = {validateRegisterRequest, validateLoginRequest}