
const db = require("../config/database");
const crypto = require("crypto");

const pool = db.promise();

const DEMO_PAYMENT_METHOD = "Demo Credit Card";
const DEMO_PAYMENT_STATUS = "Paid";

function rollbackAndRespond(connection, res, status, message) {
    connection.rollback(() => {
        connection.release();
        res.status(status).json({ message });
    });
}

/*
==========================================
Create Order
POST /api/orders
Demo payments only. No real payment is processed.
==========================================
*/
exports.createOrder = async (req, res) => {
    const userId = Number(req.user.id);

    const {
        items,
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postcode,
        payment_last4
    } = req.body;

    if (
        !Number.isSafeInteger(userId) ||
        userId < 1
    ) {
        return res.status(401).json({
            message: "Invalid authenticated user."
        });
    }

    if (
        !Array.isArray(items) ||
        items.length === 0 ||
        items.length > 100
    ) {
        return res.status(400).json({
            message: "Cart must contain between 1 and 100 items."
        });
    }

    if (
        typeof shipping_name !== "string" ||
        !shipping_name.trim() ||
        typeof shipping_phone !== "string" ||
        !shipping_phone.trim() ||
        typeof shipping_address !== "string" ||
        !shipping_address.trim() ||
        typeof shipping_city !== "string" ||
        !shipping_city.trim() ||
        typeof shipping_postcode !== "string" ||
        !shipping_postcode.trim()
    ) {
        return res.status(400).json({
            message: "Complete delivery address details are required."
        });
    }

    if (
        shipping_name.trim().length > 100 ||
        shipping_phone.trim().length > 30 ||
        shipping_address.trim().length > 5000 ||
        shipping_city.trim().length > 100 ||
        shipping_postcode.trim().length > 20
    ) {
        return res.status(400).json({
            message: "One or more delivery fields are too long."
        });
    }

    if (
        shipping_email !== undefined &&
        shipping_email !== null &&
        (
            typeof shipping_email !== "string" ||
            shipping_email.length > 150
        )
    ) {
        return res.status(400).json({
            message: "Invalid shipping email."
        });
    }

    // The demo checkout sends only the last four digits.
    // Never accept or store a full card number or CVV.
    if (
        typeof payment_last4 !== "string" ||
        !/^\d{4}$/.test(payment_last4)
    ) {
        return res.status(400).json({
            message: "Valid demo card last four digits are required."
        });
    }

    // Consolidate repeated product IDs so duplicate cart entries
    // cannot bypass stock validation.
    const quantities = new Map();

    for (const item of items) {
        const productId = Number(item?.product_id);
        const quantity = Number(item?.quantity);

        if (
            !Number.isSafeInteger(productId) ||
            productId < 1 ||
            !Number.isSafeInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                message: "Invalid order item."
            });
        }

        const combined = (quantities.get(productId) || 0) + quantity;

        if (!Number.isSafeInteger(combined)) {
            return res.status(400).json({
                message: "Invalid combined item quantity."
            });
        }

        quantities.set(productId, combined);
    }

    // Lock product rows in a consistent order and perform all writes
    // in a single transaction.
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const productIds = [...quantities.keys()].sort((a, b) => a - b);
        const placeholders = productIds.map(() => "?").join(",");

        const [products] = await connection.execute(
            `SELECT id, name, price, stock
             FROM products
             WHERE id IN (${placeholders})
             ORDER BY id
             FOR UPDATE`,
            productIds
        );

        if (products.length !== productIds.length) {
            await connection.rollback();
            connection.release();

            return res.status(400).json({
                message: "One or more products are unavailable."
            });
        }

        const productMap = new Map(
            products.map(product => [Number(product.id), product])
        );

        let totalCents = 0;
        const orderItems = [];

        for (const productId of productIds) {
            const product = productMap.get(productId);
            const quantity = quantities.get(productId);
            const stock = Number(product.stock);
            const priceCents = Math.round(Number(product.price) * 100);

            if (
                !Number.isSafeInteger(stock) ||
                stock < 0 ||
                !Number.isSafeInteger(priceCents) ||
                priceCents < 0
            ) {
                await connection.rollback();
                connection.release();

                return res.status(500).json({
                    message: "Product pricing or inventory is invalid."
                });
            }

            if (stock < quantity) {
                await connection.rollback();
                connection.release();

                return res.status(400).json({
                    message: `${product.name} has insufficient stock.`
                });
            }

            totalCents += priceCents * quantity;

            if (!Number.isSafeInteger(totalCents)) {
                await connection.rollback();
                connection.release();

                return res.status(400).json({
                    message: "Order total is too large."
                });
            }

            orderItems.push({
                productId,
                quantity,
                priceCents
            });
        }

        const total = (totalCents / 100).toFixed(2);

        // All payment metadata is controlled by the server.
        // This is a simulation, not evidence of a real payment.
        const paymentReference = `DEMO-${crypto.randomUUID()}`;

        const [orderResult] = await connection.execute(
            `INSERT INTO orders (
                user_id,
                total,
                status,
                shipping_name,
                shipping_email,
                shipping_phone,
                shipping_address,
                shipping_city,
                shipping_postcode,
                payment_method,
                payment_last4,
                payment_status,
                payment_reference
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                total,
                "Pending",
                shipping_name.trim(),
                shipping_email?.trim() || null,
                shipping_phone.trim(),
                shipping_address.trim(),
                shipping_city.trim(),
                shipping_postcode.trim(),
                DEMO_PAYMENT_METHOD,
                payment_last4,
                DEMO_PAYMENT_STATUS,
                paymentReference
            ]
        );

        const orderId = orderResult.insertId;

        for (const item of orderItems) {
            await connection.execute(
                `INSERT INTO order_items
                    (order_id, product_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.productId,
                    item.quantity,
                    (item.priceCents / 100).toFixed(2)
                ]
            );

            // The locked row and conditional update both protect stock.
            const [stockResult] = await connection.execute(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ? AND stock >= ?`,
                [
                    item.quantity,
                    item.productId,
                    item.quantity
                ]
            );

            if (stockResult.affectedRows !== 1) {
                throw new Error("Inventory changed unexpectedly.");
            }
        }

        await connection.execute(
            `INSERT INTO payments
                (order_id, amount, payment_method, payment_status)
             VALUES (?, ?, ?, ?)`,
            [
                orderId,
                total,
                DEMO_PAYMENT_METHOD,
                DEMO_PAYMENT_STATUS
            ]
        );

        await connection.commit();
        connection.release();

        return res.status(201).json({
            message: "Demo order placed successfully. No real payment was taken.",
            orderId,
            total: Number(total),
            payment_status: DEMO_PAYMENT_STATUS,
            payment_reference: paymentReference,
            payment_simulation: true
        });
    } catch (err) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Order transaction rollback failed.");
            }

            connection.release();
        }

        console.error("Order creation failed:", err.message);

        return res.status(500).json({
            message: "Unable to process the order. No order changes were committed."
        });
    }
};

/*
==========================================
Get logged-in user's orders
GET /api/orders
==========================================
*/
exports.getOrders = (req, res) => {
    const userId = req.user.id;

    db.query(
        `SELECT
            id, user_id, total, status,
            shipping_name, shipping_email, shipping_phone,
            shipping_address, shipping_city, shipping_postcode,
            payment_method, payment_last4, payment_status,
            payment_reference, created_at
         FROM orders
         WHERE user_id = ?
         ORDER BY id DESC`,
        [userId],
        (err, results) => {
            if (err) {
                console.error("Get orders failed:", err.message);
                return res.status(500).json({
                    message: "Unable to retrieve orders."
                });
            }

            res.json(results);
        }
    );
};

/*
==========================================
Get one order owned by the logged-in user
GET /api/orders/:id
==========================================
*/
exports.getOrderById = (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    db.query(
        `SELECT *
         FROM orders
         WHERE id = ? AND user_id = ?`,
        [orderId, userId],
        (err, orders) => {
            if (err) {
                console.error("Get order failed:", err.message);
                return res.status(500).json({
                    message: "Unable to retrieve order."
                });
            }

            if (orders.length === 0) {
                return res.status(404).json({
                    message: "Order not found."
                });
            }

            db.query(
                `SELECT
                    oi.id, oi.product_id, oi.quantity, oi.price,
                    p.name, p.image
                 FROM order_items oi
                 LEFT JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [orderId],
                (itemErr, items) => {
                    if (itemErr) {
                        console.error("Get order items failed:", itemErr.message);
                        return res.status(500).json({
                            message: "Unable to retrieve order items."
                        });
                    }

                    res.json({
                        ...orders[0],
                        items
                    });
                }
            );
        }
    );
};

/*
==========================================
Admin: Get all orders
GET /api/admin/orders
==========================================
*/
exports.getAllOrders = (req, res) => {
    db.query(
        `SELECT
            o.*,
            u.username,
            u.email AS user_email
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.id DESC`,
        (err, results) => {
            if (err) {
                console.error("Admin get orders failed:", err.message);
                return res.status(500).json({
                    message: "Unable to retrieve orders."
                });
            }

            res.json(results);
        }
    );
};

/*
==========================================
Admin: Get any order by ID
GET /api/admin/orders/:id
==========================================
*/
exports.getOrderByIdAdmin = (req, res) => {
    const orderId = req.params.id;

    db.query(
        `SELECT
            o.*,
            u.username,
            u.email AS user_email
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId],
        (err, orders) => {
            if (err) {
                console.error("Admin get order failed:", err.message);
                return res.status(500).json({
                    message: "Unable to retrieve order."
                });
            }

            if (orders.length === 0) {
                return res.status(404).json({
                    message: "Order not found."
                });
            }

            db.query(
                `SELECT
                    oi.*,
                    p.name,
                    p.image
                 FROM order_items oi
                 LEFT JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [orderId],
                (itemErr, items) => {
                    if (itemErr) {
                        console.error("Admin get order items failed:", itemErr.message);
                        return res.status(500).json({
                            message: "Unable to retrieve order items."
                        });
                    }

                    res.json({
                        ...orders[0],
                        items
                    });
                }
            );
        }
    );
};

/*
==========================================
Admin: Update order status
PUT /api/admin/orders/:id/status
==========================================
*/
exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Completed",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid order status."
        });
    }

    db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, orderId],
        (err, result) => {
            if (err) {
                console.error("Update order status failed:", err.message);
                return res.status(500).json({
                    message: "Unable to update order status."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Order not found."
                });
            }

            res.json({
                message: "Order status updated successfully.",
                orderId: Number(orderId),
                status
            });
        }
    );
};
