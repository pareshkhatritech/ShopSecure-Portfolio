const db = require("../config/database");

/*
==========================================
Admin Dashboard Statistics
GET /api/admin/dashboard
==========================================
*/
exports.dashboard = (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS total_users FROM users",
        (err, users) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            stats.total_users = users[0].total_users;

            db.query(
                "SELECT COUNT(*) AS total_products FROM products",
                (err, products) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    stats.total_products = products[0].total_products;

                    db.query(
                        "SELECT COUNT(*) AS total_orders, COALESCE(SUM(total),0) AS total_sales FROM orders",
                        (err, orders) => {

                            if (err) {
                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            stats.total_orders = orders[0].total_orders;
                            stats.total_sales = orders[0].total_sales;

                            res.json(stats);

                        }
                    );

                }
            );

        }
    );

};

/*
==========================================
Get All Users
GET /api/admin/users
==========================================
*/
exports.getUsers = (req, res) => {

    const search = req.query.search;

    let sql = `
        SELECT
            id,
            username,
            email,
            role,
            created_at
        FROM users
    `;

    let params = [];

    if (search) {

        sql += `
            WHERE
                username LIKE ?
                OR email LIKE ?
        `;

        params = [
            `%${search}%`,
            `%${search}%`
        ];

    }

    sql += " ORDER BY id ASC";

    db.query(sql, params, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);

    });

};

/*
==========================================
Update User Role
PUT /api/admin/users/:id/role
==========================================
*/
exports.updateUserRole = (req, res) => {

    const userId = req.params.id;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
        return res.status(400).json({
            message: "Invalid role."
        });
    }

    db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, userId],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Role updated successfully."
            });

        }
    );

};

/*
==========================================
Delete User
DELETE /api/admin/users/:id
==========================================
*/
exports.deleteUser = (req, res) => {

    const userId = parseInt(req.params.id);

    // Prevent deleting yourself
    if (userId === req.user.id) {
        return res.status(400).json({
            message: "You cannot delete your own account."
        });
    }

    db.query(
        "SELECT role FROM users WHERE id = ?",
        [userId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "User not found."
                });
            }

            const role = results[0].role;

            function performDelete() {

                db.query(
                    "DELETE FROM users WHERE id = ?",
                    [userId],
                    (err) => {

                        if (err) {
                            return res.status(500).json({
                                error: err.message
                            });
                        }

                        res.json({
                            message: "User deleted successfully."
                        });

                    }
                );

            }

            if (role === "admin") {

                db.query(
                    "SELECT COUNT(*) AS admins FROM users WHERE role='admin'",
                    (err, count) => {

                        if (err) {
                            return res.status(500).json({
                                error: err.message
                            });
                        }

                        if (count[0].admins <= 1) {
                            return res.status(400).json({
                                message: "Cannot delete the last admin."
                            });
                        }

                        performDelete();

                    }
                );

            } else {

                performDelete();

            }

        }
    );

};
