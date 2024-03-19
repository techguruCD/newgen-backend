const User = require("../models/UserModel"); //done
const PortFolioStock = require("../models/portfolioStockModel"); //done
const Portfolio = require("../models/PortfolioModel"); //done
const {getFundamentalUtil} = require('../controllers/yFinancialServices') //done t
module.exports = (response,email) => {
    
    try {
        User.find({email: email},(err, doc) => {
            Portfolio.find({ownedBy: doc[0]._id},(err, docs) => {
                PortFolioStock.find({ownedBy : docs[0].ownedBy}, (err, docss) => {
                    updateUtil(docss,docs[0],response);
                })
            })
        })
    } catch {(error) => {
        return response.status(400);
    }

    }
    
};



const updateUtil = async (stocks, portfolio, response) => {

    try {
        // console.log("final step, ", portfolio);
        // console.log("net stocks ", stocks);
        
        let netUnrealised = 0;
        let netEquityInvest = 0;
        let netWorth = 0

        for(let i =0 ; i< stocks.length; i++) {
            console.log("working on : ", stocks[i]);
            let data = await getFundamentalUtil(stocks[i].symbl)
                console.log(data);
            let currPrice = parseFloat(data?.lastPrice.replace(",",""));
            let value = currPrice*stocks[i].quantity;

            netUnrealised += value - stocks[i].totalInvestment;
            netEquityInvest += stocks[i].totalInvestment;
            netWorth += value;
            
            console.log("value: ", value, ", unrealised: ", netUnrealised);
        }


        netWorth += portfolio.funds;
        portfolio.netWorth  = netWorth
        portfolio.unrealisedProfit = netUnrealised;
        portfolio.equityInvestment = netEquityInvest;
        console.log("new PortFolio : ", portfolio);
        portfolio.save().then(saved => {
            if(portfolio == saved) {
                // saved
                return response.status(200).json({
                    message: "success"
                })
            }
        })
    } catch {(error)=>
        console.log(error);
        return response.status(400);
    }
}