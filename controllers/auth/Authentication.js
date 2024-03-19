const { generateToken } = require("../../helper/TokenHelper");
const User = require("../../models/UserModel");
const WatchList = require('../../models/WatchlistModel');
const bcrypt = require("bcrypt");
const verifyRefreshToken2 = require('../../utils/verifyRefreshToken2'); //done t
const PortfolioModel = require("../../models/PortfolioModel");

function getRefreshToken() {
  return localStorage.getItem("token");
}

const DEFAULT_ROUNDS = 4;

const initializeWatchList = async (userId) => {
  console.log("initiating ");
  const watchlist1 = new WatchList({
    symbols: [
      'INFY',
      'HDFCBANK',
      'SBIN',
      'ICICIBANK',
      'AXISBANK',
      'INDUSINDBK'
    ],
    index: 0,
    ownedBy: userId,
  });

  const watchlist2 = new WatchList({
    symbols: [],
    index: 1,
    ownedBy: userId,
  });
  const watchlist3 = new WatchList({
    symbols: [],
    index: 2,
    ownedBy: userId,
  });
  const watchlist4 = new WatchList({
    symbols: [],
    index: 3,
    ownedBy: userId,
  });
  const watchlist5 = new WatchList({
    symbols: [],
    index: 4,
    ownedBy: userId,
  });
  console.log("saving ");
  await watchlist1.save();
  console.log("saved 1");
  await watchlist2.save();
  console.log("saved 2");
  await watchlist3.save();
  console.log("saved 3");
  await watchlist4.save();
  console.log("saved 4");
  await watchlist5.save();
  console.log("saved 5");
}

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, DEFAULT_ROUNDS);

    const user = new User({ email, password: hashedPassword });
    const data = await user.save();
    const portfolio = new PortfolioModel({
      ownedBy: user._id,
      netWorth: 20000,
      unrealisedProfit: 0,
      equityInvestment: 0,
      funds: 20000
    })
    await portfolio.save();
    if (portfolio) {
      await initializeWatchList(user._id)
    }
    return res
      .status(200)
      .json({ token: generateToken({ email, role: user.role }) });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).exec();

    // don't let end user know which value was wrong
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: ["invalid email/password."] });
    }

    const token = generateToken({ email, role: user.role });

    return res
      .status(200)
      .json({ token: generateToken({ email, role: user.role }) });
  } catch (error) {
    return next(error);
  }
};

const addBalance = async (req, res) => {
  const decoded = verifyRefreshToken2(req.body.token);
  const userOld = await User.findOne({ email: decoded.email })
  const user = await User.findOneAndUpdate(
    { email: decoded.email },
    { $set: { balance: Number(userOld.balance) + Number(req.body.balance) } },
    { new: true }
  ); console.log('Token decoded', decoded.email)

  return res
    .status(200).json({ Messag: 'balance updated successfully', data: user })
}
module.exports = { register, login, addBalance };
