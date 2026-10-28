
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const db = require("../config/database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyTurnstile(token, remoteip) {
    const secret = process.env.TURNSTILE_SECRET;

    if (!secret) {
        console.error("Turnstile configuration error: TURNSTILE_SECRET is missing");
        return false;
    }

    if (!token) {
        console.error("Turnstile verification failed: token is missing");
        return false;
    }

    try {
        const response = await axios.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            new URLSearchParams({
                secret,
                response: token,
                ...(remoteip ? { remoteip } : {})
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 10000
            }
        );

        if (response.data.success !== true) {
            console.error(
                "Turnstile rejected token. Error codes:",
                response.data["error-codes"] || ["unknown-error"]
            );
            return false;
        }

        return true;
    } catch (error) {
        console.error(
            "Turnstile verification request failed:",
            error.response?.data || error.message
        );
        return false;
    }
}

/*
REGISTER USER
POST /api/register
*/
router.post("/register", async (req, res) => {
    const { username, email, password, turnstileToken } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const captchaValid = await verifyTurnstile(
            turnstileToken,
            req.ip
        );

        if (!captchaValid) {
            return res.status(400).json({
                message: "Security verification failed. Please try again."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            `INSERT INTO users (username, email, password)
             VALUES (?, ?, ?)`,
            [username.trim(), email.trim().toLowerCase(), hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "An account with this email already exists."
                        });
                    }

                    console.error("Registration database error:", err.code || err.message);

                    return res.status(500).json({
                        message: "Could not create your account. Please try again."
                    });
                }

                return res.status(201).json({
                    message: "User registered successfully",
                    userId: result.insertId
                });
            }
        );
    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Registration failed due to a server error."
        });
    }
});

/*
LOGIN USER
POST /api/login
*/
router.post("/login", async (req, res) => {
    const { email, password, turnstileToken } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        const captchaValid = await verifyTurnstile(
            turnstileToken,
            req.ip
        );

        if (!captchaValid) {
            return res.status(400).json({
                message: "Security verification failed. Please try again."
            });
        }

        if (!JWT_SECRET) {
            console.error("Login configuration error: JWT_SECRET is missing");

            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }

        db.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [email.trim().toLowerCase()],
            async (err, results) => {
                if (err) {
                    console.error("Login database error:", err.code || err.message);

                    return res.status(500).json({
                        message: "Login failed due to a database error."
                    });
                }

                if (!results || results.length === 0) {
                    return res.status(401).json({
                        message: "Invalid credentials"
                    });
                }

                try {
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

                    const token = jwt.sign(
                        {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role
                        },
                        JWT_SECRET,
                        { expiresIn: "1h" }
                    );

                    return res.json({
                        message: "Login successful",
                        token
                    });
                } catch (error) {
                    console.error("Login processing error:", error.message);

                    return res.status(500).json({
                        message: "Login failed due to a server error."
                    });
                }
            }
        );
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Login failed due to a server error."
        });
    }
});

module.exports = router;
