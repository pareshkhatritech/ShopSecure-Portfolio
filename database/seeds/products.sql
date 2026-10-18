USE shopsecure;

DELETE FROM products;

ALTER TABLE products AUTO_INCREMENT = 1;

INSERT INTO products
(name, description, category, brand, price, stock, image, rating, reviews, featured, discount)
VALUES
('Apple MacBook Pro 16 M4','16-inch Apple laptop with M4 Pro chip, 32GB RAM and 1TB SSD.','Laptops','Apple',2899.99,15,'/images/products/laptops/macbook-pro-16.jpg',4.9,845,1,10),

('Dell XPS 15','Premium Windows ultrabook with Intel Core Ultra processor.','Laptops','Dell',2199.99,18,'/images/products/laptops/dell-xps-15.jpg',4.8,620,1,15),

('HP Spectre x360','Convertible touchscreen business laptop.','Laptops','HP',1799.99,20,'/images/products/laptops/hp-spectre-x360.jpg',4.7,412,0,10),

('Lenovo ThinkPad X1 Carbon','Enterprise ultrabook with exceptional keyboard.','Laptops','Lenovo',1899.99,22,'/images/products/laptops/thinkpad-x1.jpg',4.8,510,1,12),

('ASUS ROG Strix G16','Gaming laptop with RTX graphics.','Gaming','ASUS',2099.99,14,'/images/products/gaming/rog-g16.jpg',4.8,391,1,20),

('MSI Raider GE78','High-performance gaming laptop for enthusiasts.','Gaming','MSI',2599.99,10,'/images/products/gaming/msi-raider.jpg',4.9,244,1,15),

('Samsung Odyssey G8','34-inch OLED gaming monitor.','Monitors','Samsung',999.99,18,'/images/products/monitors/odyssey-g8.jpg',4.8,358,1,18),

('LG UltraGear 27','27-inch QHD 165Hz gaming monitor.','Monitors','LG',449.99,25,'/images/products/monitors/lg-ultragear.jpg',4.7,480,0,10),

('Logitech MX Master 3S','Premium wireless productivity mouse.','Mice','Logitech',99.99,60,'/images/products/mice/mx-master-3s.jpg',4.9,2104,1,5),

('Logitech G Pro X Superlight','Professional esports gaming mouse.','Mice','Logitech',149.99,40,'/images/products/mice/gpro-superlight.jpg',4.9,1640,1,12);
