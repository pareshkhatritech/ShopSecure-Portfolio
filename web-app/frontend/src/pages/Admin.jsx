import { Routes, Route, Navigate } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";

import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import Products from "./admin/Products";
import Orders from "./admin/Orders";
import Analytics from "./admin/Analytics";

export default function Admin() {

    return (

        <div className="container-fluid p-0">

            <div className="d-flex">

                <div
                    className="bg-dark text-white"
                    style={{
                        width: "260px",
                        minHeight: "100vh",
                        position: "sticky",
                        top: 0
                    }}
                >
                    <AdminSidebar />
                </div>

                <div
                    className="flex-grow-1 p-4"
                    style={{
                        background: "#f8f9fa",
                        minHeight: "100vh"
                    }}
                >

                    <Routes>

                        <Route
                            index
                            element={<Navigate to="dashboard" replace />}
                        />

                        <Route
                            path="dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="users"
                            element={<Users />}
                        />

                        <Route
                            path="products"
                            element={<Products />}
                        />

                        <Route
                            path="orders"
                            element={<Orders />}
                        />

                        <Route
                            path="analytics"
                            element={<Analytics />}
                        />

                    </Routes>

                </div>

            </div>

        </div>

    );

}
