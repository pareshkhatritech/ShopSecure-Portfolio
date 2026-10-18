const db = require("../config/database");

exports.getProfile = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            u.username,
            u.email,
            u.created_at,
            COUNT(DISTINCT o.id) AS total_orders,
            COALESCE(SUM(oi.quantity), 0) AS items_purchased,
            COALESCE(SUM(o.total), 0) AS total_spent
        FROM users u
        LEFT JOIN orders o
            ON u.id = o.user_id
        LEFT JOIN order_items oi
            ON o.id = oi.order_id
        WHERE u.id = ?
        GROUP BY
            u.id,
            u.username,
            u.email,
            u.created_at
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(results[0]);

    });

};
