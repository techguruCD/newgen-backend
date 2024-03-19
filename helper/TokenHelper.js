const jwt = require('jsonwebtoken');

const TOKEN_SECRET = process.env.TOKEN_SECRET

const generateToken = (payload) => {
  return jwt.sign(payload, TOKEN_SECRET);
}

const parseToken = (token) => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (error) {
    console.error("JWT verification error:", error);
    throw error;
  }
};

module.exports = {
  generateToken,
  parseToken
}