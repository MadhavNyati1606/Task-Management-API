const CustomErrorAPI = require("./custom-error");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found");
const UnauthenticatedError = require("./unauthenticated");

module.exports = {
  CustomErrorAPI,
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
};
