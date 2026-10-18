const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");

const adminController = require("../controllers/adminController");
const productsController = require("../controllers/productsController");
const ordersController = require("../controllers/ordersController");
const analyticsController = require("../controllers/analyticsController");

/*
==========================================
Dashboard
==========================================
*/
router.get(
    "/admin/dashboard",
    verifyToken,
    verifyAdmin,
    adminController.dashboard
);

/*
==========================================
Users
==========================================
*/
router.get(
    "/admin/users",
    verifyToken,
    verifyAdmin,
    adminController.getUsers
);

router.put(
    "/admin/users/:id/role",
    verifyToken,
    verifyAdmin,
    adminController.updateUserRole
);

router.delete(
    "/admin/users/:id",
    verifyToken,
    verifyAdmin,
    adminController.deleteUser
);

/*
==========================================
Products
==========================================
*/

router.get(
    "/admin/products",
    verifyToken,
    verifyAdmin,
    productsController.getProducts
);

router.post(
    "/admin/products",
    verifyToken,
    verifyAdmin,
    productsController.createProduct
);

router.put(
    "/admin/products/:id",
    verifyToken,
    verifyAdmin,
    productsController.updateProduct
);

router.delete(
    "/admin/products/:id",
    verifyToken,
    verifyAdmin,
    productsController.deleteProduct
);

/*
==========================================
Orders
==========================================
*/

router.get(
    "/admin/orders",
    verifyToken,
    verifyAdmin,
    ordersController.getAllOrders
);

router.get(
    "/admin/orders/:id",
    verifyToken,
    verifyAdmin,
    ordersController.getOrderByIdAdmin
);

router.put(
    "/admin/orders/:id/status",
    verifyToken,
    verifyAdmin,
    ordersController.updateOrderStatus
);

/*
==========================================
Analytics
==========================================
*/

router.get(
    "/admin/analytics",
    verifyToken,
    verifyAdmin,
    analyticsController.getAnalytics
);

module.exports = router;
