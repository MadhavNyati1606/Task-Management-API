const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many wrong attempts. Please try again after 1 minute",
  standardHeader: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
