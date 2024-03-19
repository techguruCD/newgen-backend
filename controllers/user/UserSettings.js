const UserModel = require("../../models/UserModel");

const updateUser = async (req, res, next) => {
  try {
    const { paperBalance } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: req.id },
      { paperBalance },
      { new: true },
    );
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

module.exports = { updateUser, deleteUser };
