const axios =require("axios");
const extractChartData = require("../utils/extractChartData"); //done
var API = require('indian-stock-exchange'); //done
const base_url = "https://query2.finance.yahoo.com";
const scrape_url = "https://finance.yahoo.com/quote/";

user_agent_headers = {'User-Agent': 'Mozilla/5.0'}
var NSEAPI = API.NSE;

const getHistory = (request, response) => {

    let symbl = request.params.symbl+".NS";
    const request_url = base_url + "/v8/finance/chart/" + symbl;
    axios(request_url,{
        params : {
            interval : request.body.interval,
            events : "div,splits",
            range : request.body.period,
        },
        headers : user_agent_headers
    }).then((data) => {
        // console.log(data);
        const result = extractChartData(data.data);
        return response.status(200).json({
            result : result
        })
    }).catch((error) => {
        // console.log(error)
        return response.status(400).json({
            result : "error occured"
        })
        
    });
}


const getFundamentals = async (request, response) => {

    return response.status(404).json({})
    let symbl = request.params.symbl;
    try {
        NSEAPI.getQuoteInfo(symbl).then((data) => {
            // console.log(data.data);
            return response.status(200).json({
                result: data.data.data[0]
            })
        }) 

    } catch(error) {
        return response.status(500);
    }
    
}

const getFundamentalUtil =  async (symbl) => 
    await NSEAPI.getQuoteInfo(symbl).then((data) => {
            return data.data.data[0]
        }) 

    



module.exports = {
    getHistory,
    getFundamentals,
    getFundamentalUtil
};