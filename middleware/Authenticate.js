const UserModel = require('../models/UserModel');
const VALIDATION_MESSAGES = require("../contants/ValidationMessages");
const { parseToken } = require("../helper/TokenHelper");
const { buildErrorMessage } = require("../validators/BaseValidator");

const authenticate = async (req, res, next) => {
  
  try {
    // expresses header get method is case insensitive
    const authHeader = req.get("authorization");
    // I used bearer tokens which are structured like: 'Authorization': 'Bearer <TOKEN>'
    // but first we make sure that authHeader is not undefined
    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.body.token || req.query.token;
    
    if (!token) {
      return res
        .status(401)
        .json({
          errors: [buildErrorMessage(VALIDATION_MESSAGES["MISSING_TOKEN"])],
        });
    }

    const decodedToken = parseToken(token);
    
    
    // set top-level request fields for usage in controllers
    req.email = decodedToken.email;
    req.role = decodedToken.role;
    const user = await UserModel.findOne({'email': decodedToken.email}, {_id: 1}).exec();
    if (!user) {
      throw new Error("Token was valid but user does not exist.");
    }

    req.id = user._id;
  } catch (error) {
    if (
      error.name == "TokenExpiredError" ||
      error.name == "JsonWebTokenError"
    ) {
      return res
        .status(401)
        .json({
          errors: [buildErrorMessage(VALIDATION_MESSAGES["INVALID_TOKEN"])],
        });
    }
  }

  return next();
};

module.exports = authenticate;