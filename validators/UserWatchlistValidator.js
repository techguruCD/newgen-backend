const WatchlistModel = require("../models/WatchlistModel");
const VALIDATION_MESSAGES = require("../contants/ValidationMessages");
const { validateExists, buildErrorMessage } = require("./BaseValidator");

const validateWatchlistName = (name) => {
  const errors = [];
  if (!validateExists(name, "string") || name.trim().length < 1) {
    errors.push(
      buildErrorMessage(VALIDATION_MESSAGES["INVALID_FIELD"], "name"),
    );
  }

  return errors;
};

const validateCreateWatchlistRequest = async (req, res, next) => {
  const { name } = req.body;

  let errors = validateWatchlistName(name);

  if (await WatchlistModel.exists({ userId: req.id, name: name })) {
    errors.push(buildErrorMessage(VALIDATION_MESSAGES["UNIQUE_FIELD"], "name"));
  }

  if (errors.length > 0) {
    req.errors.status = 422;
    req.errors.messages.push(...errors);
    return next("ValidationException");
  }

  return next();
};

const validateDeleteWatchlist = async (req, res, next) => {
  const { name } = req.body;

  let errors = validateWatchlistName(name);

  if (!(await WatchlistModel.exists({ userId: req.id, name: name }))) {
    errors.push(
      buildErrorMessage(VALIDATION_MESSAGES["NOT_FOUND"], "name"),
    );
  }

  if (errors.length > 0) {
    req.errors.status = 422;
    req.errors.messages.push(...errors);
    return next("ValidationException");
  }

  return next();
};

module.exports = {validateCreateWatchlistRequest, validateDeleteWatchlist}