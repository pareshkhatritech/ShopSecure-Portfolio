const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");
const profileController = require("../controllers/profileController");

/*
==========================================
Get Logged-in User Profile
GET /api/profile
==========================================
*/
router.get(
    "/profile",
    verifyToken,
    profileController.getProfile
);

module.exports = router;
