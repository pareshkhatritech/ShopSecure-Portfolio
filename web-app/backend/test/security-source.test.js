const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("login reads the JWT secret from the environment and fails closed when absent", () => {
    const auth = read("web-app/backend/routes/auth.js");
    assert.match(auth, /const JWT_SECRET = process\.env\.JWT_SECRET/);
    assert.match(auth, /if \(!JWT_SECRET\)/);
    assert.doesNotMatch(auth, /JWT_SECRET\s*=\s*["'][^"']+["']/);
});

test("login uses a parameterized email lookup", () => {
    const auth = read("web-app/backend/routes/auth.js");
    assert.match(auth, /WHERE email = \?/);
    assert.match(auth, /db\.query\(sql, \[email\]/);
});

test("individual order lookup scopes the query to the authenticated user", () => {
    const orders = read("web-app/backend/controllers/ordersController.js");
    assert.match(orders, /WHERE id = \? AND user_id = \?/);
    assert.match(orders, /\[orderId, userId\]/);
});

test("checkout validates item counts and demo payment data and protects stock updates", () => {
    const orders = read("web-app/backend/controllers/ordersController.js");
    assert.match(orders, /items\.length > 100/);
    assert.match(orders, /\^\\d\{4\}\$/);
    assert.match(orders, /beginTransaction\(\)/);
    assert.match(orders, /stock = stock - \?\s+WHERE id = \? AND stock >= \?/);
    assert.match(orders, /connection\.rollback\(\)/);
});

test("fresh-install seed creates sample products but no orphaned users or orders", () => {
    const seed = read("database/init/01-init.sql");
    assert.match(seed, /INSERT INTO products/i);
    assert.match(seed, /shipping_name VARCHAR\\(100\\) NOT NULL/);
    assert.match(seed, /payment_last4 CHAR\\(4\\) NOT NULL/);
    assert.match(seed, /payment_reference VARCHAR\\(100\\) NOT NULL/);
    assert.doesNotMatch(seed, /INSERT INTO users/i);
    assert.doesNotMatch(seed, /INSERT INTO orders/i);
    assert.doesNotMatch(seed, /INSERT INTO order_items/i);
    assert.doesNotMatch(seed, /INSERT INTO payments/i);
});

test("destructive external catalog importer is absent", () => {
    assert.equal(
        fs.existsSync(path.join(root, "web-app/backend/scripts/importProducts.js")),
        false
    );
});
