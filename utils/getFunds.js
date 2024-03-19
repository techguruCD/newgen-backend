const PortFolio = require("../models/PortfolioModel");
const User = require("../models/UserModel");


function getFund(email, response) {
    User.find({ email: email })
        .then(doc => {
            if (doc.length > 0) {
                utilFunction(doc[0], response);
            } else {
                console.log("User not found")
                return resposne.status(400).json({
                    message: "Logout"
                })
            }
        })
    // User.find({email: email},(err,doc) => {
    //     if(doc.length > 0) {
    //         utilFunction(doc[0],response);
    //     } else {
    //         console.log("User not found")
    //         return resposne.status(400).json({
    //             message : "Logout"
    //         })
    //     }
    // })
}


const utilFunction = (user, response) => {
    PortFolio.find({
        ownedBy: user._id
    })
        .then(doc => {

            console.log(" kee jae");
            if (doc.length > 0) {
                return response.status(200).json({
                    funds: doc[0].funds
                })
            } else {
                return response.status(400).json({
                    message: "Logout"
                })
            }
        })
        .catch(err => {
            console.log("Funds kee baat", err);
        });
    // PortFolio.find({
    //     ownedBy: user._id
    // }, (err, doc) => {

    //     console.log("Funds kee baat", err, " kee jae", doc);
    //     if (doc.length > 0) {
    //         return response.status(200).json({
    //             funds: doc[0].funds
    //         })
    //     } else {
    //         return response.status(400).json({
    //             message: "Logout"
    //         })
    //     }
    // });
}

module.exports = getFund;