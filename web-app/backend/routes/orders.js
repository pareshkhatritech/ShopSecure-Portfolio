const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");
const ordersController = require("../controllers/ordersController");

/*
==========================================
Create Order
POST /api/orders
==========================================
*/
router.post(
    "/",
    verifyToken,
    ordersController.createOrder
);

/*
==========================================
Get logged-in user's orders
GET /api/orders
==========================================
*/
router.get(
    "/",
    verifyToken,
    ordersController.getOrders
);

/*
==========================================
Get a specific order
GET /api/orders/:id
==========================================
*/
router.get(
    "/:id",
    verifyToken,
    ordersController.getOrderById
);

module.exports = router;
