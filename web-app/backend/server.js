const express = require("express");
require("dotenv").config();

require("./config/database");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");
const labRoutes = require("./routes/lab");
const app = express();
app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("ShopSecure API is running");
});

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", profileRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api", adminRoutes);
app.use("/api", labRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
