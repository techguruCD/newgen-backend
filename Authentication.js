const { generateToken } = require("../../helper/TokenHelper");
const User = require("../../models/UserModel");
const bcrypt = require("bcrypt");
const verifyRefreshToken2 = require('../../utils/verifyRefreshToken2'); //done t

function getRefreshToken() {
  return localStorage.getItem("token");
}

const DEFAULT_ROUNDS = 4;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, DEFAULT_ROUNDS);

    const user = new User({ email, password: hashedPassword });
    await user.save();

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

const addBalance = async(req, res) =>{
  const decoded = verifyRefreshToken2(req.body.token);
  const userOld = await User.findOne({email: decoded.email})
  const user = await User.findOneAndUpdate(
    { email: decoded.email },
    { $set: { balance: Number(userOld.balance) + Number(req.body.balance) } },
    { new: true }
  );  console.log('Token decoded',decoded.email)

  return res
      .status(200).json({Messag: 'balance updated successfully', data: user })
}
module.exports = { register, login,addBalance };
