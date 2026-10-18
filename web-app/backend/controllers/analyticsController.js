const db = require("../config/database");
/*
==========================================
Analytics Dashboard
GET /api/admin/analytics
==========================================
*/
exports.getAnalytics = (req, res) => {

    const analytics = {};

    db.query(
        "SELECT COUNT(*) AS total_users FROM users",
        (err, users) => {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            analytics.total_users = users[0].total_users;

            db.query(
                "SELECT COUNT(*) AS total_products FROM products",
                (err, products) => {

                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    analytics.total_products = products[0].total_products;

                    db.query(
                        "SELECT COUNT(*) AS total_orders, COALESCE(SUM(total),0) AS total_sales FROM orders",
                        (err, orders) => {

                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }

                            analytics.total_orders = orders[0].total_orders;
                            analytics.total_sales = orders[0].total_sales;

                            db.query(
                                `SELECT
                                    id,
                                    total,
                                    status,
                                    created_at
                                 FROM orders
                                 ORDER BY created_at DESC
                                 LIMIT 5`,
                                (err, recentOrders) => {

                                    if (err) {
                                        return res.status(500).json({
                                            error: err.message
                                        });
                                    }

                                    analytics.recent_orders = recentOrders;

                                    db.query(
                                        `SELECT
                                            id,
                                            name,
                                            stock
                                         FROM products
                                         WHERE stock < 5
                                         ORDER BY stock ASC`,
                                        (err, lowStock) => {

                                            if (err) {
                                                return res.status(500).json({
                                                    error: err.message
                                                });
                                            }

                                            analytics.low_stock = lowStock;

                                            db.query(
                                                `SELECT
                                                    p.id,
                                                    p.name,
                                                    COALESCE(SUM(oi.quantity),0) AS sold
                                                FROM products p
                                                LEFT JOIN order_items oi
                                                    ON p.id = oi.product_id
                                                GROUP BY p.id
                                                ORDER BY sold DESC
                                                LIMIT 5`,
                                                (err, topProducts) => {

                                                    if (err) {
                                                        return res.status(500).json({
                                                            error: err.message
                                                        });
                                                    }

                                                    analytics.top_products = topProducts;

                                                    db.query(
                                                        `SELECT
                                                            id,
                                                            username,
                                                            email,
                                                            created_at
                                                        FROM users
                                                        ORDER BY created_at DESC
                                                        LIMIT 5`,
                                                        (err, recentUsers) => {

                                                            if (err) {
                                                                return res.status(500).json({
                                                                    error: err.message
                                                                });
                                                            }

                                                            analytics.recent_users = recentUsers;

                                                            res.json(analytics);

                                                        }
                                                    );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};
