CREATE DATABASE IF NOT EXISTS shopsecure;

USE shopsecure;

-- ===========================
-- Users
-- ===========================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Products
-- ===========================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 4.5,
    reviews INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    discount INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ===========================
-- Orders
-- ===========================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ===========================
-- Order Items
-- ===========================

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),

    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id)
);

-- ===========================
-- Payments
-- ===========================

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'Pending',

    FOREIGN KEY (order_id)
    REFERENCES orders(id)
);

-- ===========================
-- Sample Users
-- Demo accounts are intentionally omitted.
-- Create users through the application so passwords are hashed.
-- ===========================

-- ===========================
-- Sample Products
-- ===========================

INSERT INTO products(name,description,category,price,stock)
VALUES
('Gaming Laptop','High performance laptop','Electronics',1299.99,10),
('Mechanical Keyboard','RGB Keyboard','Accessories',89.99,25),
('Wireless Mouse','Gaming Mouse','Accessories',49.99,40),
('27 Inch Monitor','IPS Display','Electronics',299.99,15);

-- ===========================
-- Sample Orders
-- ===========================

INSERT INTO orders(user_id,total,status)
VALUES
(2,1389.98,'Completed'),
(3,49.99,'Pending');

INSERT INTO order_items(order_id,product_id,quantity,price)
VALUES
(1,1,1,1299.99),
(1,2,1,89.99),
(2,3,1,49.99);

INSERT INTO payments(order_id,amount,payment_method,payment_status)
VALUES
(1,1389.98,'Credit Card','Paid'),
(2,49.99,'PayPal','Pending');
