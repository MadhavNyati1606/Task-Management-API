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
  const refreshToken = user.generateRefreshToken();

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const refreshUser = async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    throw new UnauthenticatedError(
      "Refresh Token not available. Please login again"
    );
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email, role: payload.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.json({ newAccessToken });
  } catch (err) {
    res.status(403).json({ msg: "Invalid Refresh Token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshUser,
};
