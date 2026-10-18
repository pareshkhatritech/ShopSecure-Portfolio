const db = require("../config/database");

/*
==========================================
Get All Products
GET /api/products
GET /api/products?search=
==========================================
*/
exports.getProducts = (req, res) => {

    const search = req.query.search;

    let sql = `
        SELECT
            id,
            name,
            description,
            category,
            price,
            stock,
            image,
            brand,
            rating,
            reviews,
            featured,
            discount,
            created_at
        FROM products
    `;

    let params = [];

    if (search) {

        sql += `
            WHERE
                name LIKE ?
                OR category LIKE ?
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
Get Single Product
GET /api/products/:id
==========================================
*/
exports.getProductById = (req, res) => {

    db.query(
        "SELECT * FROM products WHERE id=?",
        [req.params.id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Product not found."
                });
            }

            res.json(results[0]);

        }
    );

};

/*
==========================================
Create Product
POST /api/products
==========================================
*/
exports.createProduct = (req, res) => {

    const {
        name,
        description,
        category,
        price,
        stock,
        image
    } = req.body;

    db.query(
        `INSERT INTO products
        (name,description,category,price,stock,image)
        VALUES(?,?,?,?,?,?)`,
        [
            name,
            description,
            category,
            price,
            stock,
            image
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Product created successfully.",
                id: result.insertId
            });

        }
    );

};

/*
==========================================
Update Product
PUT /api/products/:id
==========================================
*/
exports.updateProduct = (req, res) => {

    const {
        name,
        description,
        category,
        price,
        stock,
        image
    } = req.body;

    db.query(
        `UPDATE products
         SET
            name=?,
            description=?,
            category=?,
            price=?,
            stock=?,
            image=?
         WHERE id=?`,
        [
            name,
            description,
            category,
            price,
            stock,
            image,
            req.params.id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Product updated successfully."
            });

        }
    );

};

/*
==========================================
Delete Product
DELETE /api/products/:id
==========================================
*/
exports.deleteProduct = (req, res) => {

    db.query(
        "DELETE FROM products WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Product deleted successfully."
            });

        }
    );

};
