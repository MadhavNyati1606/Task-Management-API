const { StatusCodes } = require("http-status-codes");
const { CustomErrorAPI } = require("../errors");

const errorHandler = (err, req, res, next) => {
  let customErrorResponse = {
    msg: err.message || "Something went wrong. Please try again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === "ValidationError") {
    customErrorResponse.msg = Object.values(err.errors)
      .map((item) => {
        return item.message;
      })
      .join(",");
    customErrorResponse.statusCode = 400;
  }

  if (err.name === "CastError") {
    (customErrorResponse.msg = `No task found with id ${err.value}`),
      (customErrorResponse.statusCode = 404);
  }

  if (err.code === 11000) {
    customErrorResponse.msg = `Duplicate values found of ${Object.keys(
      err.keyValue
    )}. Please try again with different values`;
    customErrorResponse.statusCode = 400;
  }

  return res
    .status(customErrorResponse.statusCode)
    .json({ msg: customErrorResponse.msg });
};

module.exports = errorHandler;
