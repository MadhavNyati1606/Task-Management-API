const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.generateAuthToken();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all the details");
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isEqual = await user.comparePassword(password);
  if (!isEqual) {
    throw new UnauthenticatedError(
      "Please enter the correct authentication details"
    );
  }
  const token = user.generateAuthToken();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  registerUser,
  loginUser,
};
