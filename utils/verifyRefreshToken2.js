const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken'


require("dotenv").config()

const tokenSecret = process.env.TOKEN_SECRET

module.exports = (token)  => 
    jwt.verify(token, tokenSecret, function(err, decoded) {
        if (err) {
                return err;
            // )
        } else {
            console.log("token decoded");
            return decoded;
        }
    });


