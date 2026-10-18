const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");
const productsController = require("../controllers/productsController");

// Public: browse products
router.get("/products", productsController.getProducts);
router.get("/products/:id", productsController.getProductById);

// Admin only: manage products
router.post(
    "/products",
    verifyToken,
    verifyAdmin,
    productsController.createProduct
);

router.put(
    "/products/:id",
    verifyToken,
    verifyAdmin,
    productsController.updateProduct
);

router.delete(
    "/products/:id",
    verifyToken,
    verifyAdmin,
    productsController.deleteProduct
);

module.exports = router;
