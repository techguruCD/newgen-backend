const PositionModel = require("../../models/PositionModel");

const getAllEntries = async (req, res, next) => {
  try {
    let {lastCreatedAt} = req.query;
    let query = {userId: req.id};
    if (lastCreatedAt) {
      query.lastCreatedAt = {$lt: lastCreatedAt};
    }

    const positions = await PositionModel.find(query).populate(["symbol", "orderId"]).limit(25).sort('createdAt');

    return res.status(200).json({positions});
  }
  catch(error) {
    return next(error)
  }
}

module.exports = {getAllEntries};