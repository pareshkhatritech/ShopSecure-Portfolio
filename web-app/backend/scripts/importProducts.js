const axios = require("axios");
const db = require("../config/database");

async function importProducts() {
    try {
        console.log("Downloading products...");

        const response = await axios.get(
            "https://dummyjson.com/products?limit=100"
        );

        const products = response.data.products;

        console.log(`Found ${products.length} products`);

        db.query("DELETE FROM products", (err) => {
            if (err) {
                console.error(err);
                process.exit();
            }

            let inserted = 0;

            products.forEach((product) => {

                const sql = `
                    INSERT INTO products
                    (
                        name,
                        description,
                        category,
                        brand,
                        price,
                        stock,
                        image,
                        rating,
                        reviews,
                        featured,
                        discount
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    sql,
                    [
                        product.title,
                        product.description,
                        product.category,
                        product.brand || "Unknown",
                        product.price,
                        product.stock,
                        product.thumbnail,
                        product.rating,
                        Math.floor(Math.random() * 2000) + 50,
                        Math.random() > 0.7 ? 1 : 0,
                        product.discountPercentage
                            ? Math.round(product.discountPercentage)
                            : 0
                    ],
                    (err) => {

                        if (err) {
                            console.log(err);
                            return;
                        }

                        inserted++;

                        if (inserted === products.length) {

                            console.log(
                                `Successfully imported ${inserted} products`
                            );

                            process.exit();

                        }

                    }
                );

            });

        });

    } catch (err) {

        console.error(err.message);

    }
}

importProducts();
