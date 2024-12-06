const express = require("express");
const router = express.Router();
const { registerUser, loginUser, refreshUser } = require("../controllers/auth");
const rateLimit = require("../middleware/rateLimit");

router.route("/register").post(registerUser);
router.post("/login", rateLimit, loginUser);
router.route("/refresh").post(refreshUser);

module.exports = router;
