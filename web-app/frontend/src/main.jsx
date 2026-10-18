import React from "react";
import ReactDOM from "react-dom/client";

import CartProvider from "./context/CartContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";

import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <CartProvider>

            <App />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />

        </CartProvider>

    </React.StrictMode>

);
