const User = require("../models/UserModel");
const PortFolioStock = require("../models/portfolioStockModel");

module.exports = (email, symbl, response) => {

    User.find({ email: email })
        .then(user => {
            if (user.length > 0) {
                findUtil(user[0], symbl, response);
            } else {
                return response.status(400).json({
                    message: err
                })
            }
        })
        .catch(err => { })
}

const findUtil = (user, symbl, response) => {

    PortFolioStock.find({ ownedBy: user._id, symbl: symbl })
        .then(data => {
            if (data.length > 0) {
                return response.status(200).json({
                    result: data[0].quantity
                });
            } else {
                return response.status(200).json({
                    result: false
                })
            }
        })
        .catch(err => { })
}