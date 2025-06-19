const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/profile", isAuthenticated, getUserProfile);

module.exports = router;
