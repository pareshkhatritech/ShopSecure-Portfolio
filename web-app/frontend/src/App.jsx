import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import GoToTop from "./components/GoToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <main>

                <Routes>

                    <Route path="/" element={<Home />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route path="/products" element={<Products />} />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />

                    <Route path="/cart" element={<Cart />} />

                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/orders" element={<Orders />} />

                    <Route
                        path="/orders/:id"
                        element={<OrderDetails />}
                    />

                    <Route path="/profile" element={<Profile />} />

                    <Route path="/admin/*" element={<Admin />} />

                </Routes>

            </main>

            <Footer />

            <GoToTop />

        </BrowserRouter>
    );
}

export default App;
