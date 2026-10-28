const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const db = require("../config/database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET;

async function verifyTurnstile(token, remoteip) {
    if (!TURNSTILE_SECRET) {
        console.error("TURNSTILE_SECRET is missing");
        return false;
    }

    if (!token) {
        return false;
    }

    try {
        const response = await axios.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                secret: TURNSTILE_SECRET,
                response: token,
                remoteip
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        );

        if (response.data.success !== true) {
    console.error(
        "Turnstile rejected token:",
        response.data["error-codes"]
    );
}
return response.data.success === true;
} catch (error) {
    console.error(
        "Turnstile verification error:",
        error.response?.data || error.message
    );
    return false;
}

/*
REGISTER USER
POST /api/register
*/
router.post("/register", async (req, res) => {
    const {
        username,
        email,
        password,
        turnstileToken
    } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const captchaValid = await verifyTurnstile(
        turnstileToken,
        req.ip
    );

    if (!captchaValid) {
        return res.status(400).json({
            message: "Security verification failed. Please try again."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users
            (username, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [username, email, hashedPassword],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                res.json({
                    message: "User registered successfully",
                    userId: result.insertId
                });
            }
        );

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

/*
LOGIN USER
POST /api/login
*/
router.post("/login", async (req, res) => {
    const {
        email,
        password,
        turnstileToken
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const captchaValid = await verifyTurnstile(
        turnstileToken,
        req.ip
    );

    if (!captchaValid) {
        return res.status(400).json({
            message: "Security verification failed. Please try again."
        });
    }

    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const user = results[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });
    });
});

module.exports = router;
