const express = require("express");

const router = express.Router();

const sqliController = require("../controllers/lab/sqliController");

/*
==========================================
SQL Injection Lab
==========================================
*/

router.post(
    "/lab/login-sqli",
    sqliController.login
);

module.exports = router;
