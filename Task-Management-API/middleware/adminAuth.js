const jwt = require("jsonwebtoken");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const adminAuth = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authorization invalid.");
  }
  const token = auth.split(" ")[1];

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decode.role !== "admin") {
      throw new UnauthenticatedError(
        "Authorization allowed for only admin role users"
      );
    }
    req.user = { userId: decode.id, email: decode.email, role: decode.role };
    next();
  } catch (err) {
    throw new UnauthenticatedError("Authorization Invalid");
  }
};

module.exports = adminAuth;
