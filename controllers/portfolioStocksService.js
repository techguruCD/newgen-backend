const sendAlPortfolioStocks = require('../utils/sendAlPortfolioStocks')
const sellingLimit = require('../utils/sellingLimit')
const getAll = (request, response) => {
    console.log("getAll : ", request.body.token);
    sendAlPortfolioStocks(request.email, response);
};

const getSellLimit = (request, response) => {
    const symbl = request.body.symbl;
    sellingLimit(request.email, symbl, response);
}

module.exports = {
    getAll,
    getSellLimit
}