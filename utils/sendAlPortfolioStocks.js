
const PortFolioStock = require("../models/portfolioStockModel")
const User = require("../models/UserModel");




const functionUtil = (user, response) => {
    console.log("finding owned stocks : ", String(user._id));
    PortFolioStock.find({ ownedBy: String(user._id) })
        .then(doc => {
            console.log("i searched ", doc);
            response.status(200).json({
                result: doc
            })
        })
        .catch(err => {
            console.log(" errors : ", err);
        })
}


const sendAlPortfolioStocks = (email, response) => {

    console.log("a query came : ");
    User.find({ email: email })
    .then(doc => {
        if (doc.length > 0) {
            console.log("user found for stocks");
            functionUtil(doc[0], response);
        } else {
            response.status(400).json({
                message: "Logout"
            })
        }
    })
    .catch(err => {
        
    })
    // User.find({ email: email }, (err, doc) => {
    //     if (doc.length > 0) {
    //         console.log("user found for stocks");
    //         functionUtil(doc[0], response);
    //     } else {
    //         response.status(400).json({
    //             message: "Logout"
    //         })
    //     }
    // })
};


module.exports = sendAlPortfolioStocks