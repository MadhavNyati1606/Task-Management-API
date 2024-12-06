const express = require("express");
const router = express.Router();
const { registerUser, loginUser, refreshUser } = require("../controllers/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh").post(refreshUser);

module.exports = router;
