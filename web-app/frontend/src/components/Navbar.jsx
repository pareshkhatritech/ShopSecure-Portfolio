import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaSearch } from "react-icons/fa";

import "../styles/navbar.css";

export default function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    let user = null;

    if (token) {

        try {

            user = JSON.parse(atob(token.split(".")[1]));

        } catch {

            localStorage.removeItem("token");

        }

    }

    function logout() {

        localStorage.removeItem("token");

        navigate("/login");

        window.location.reload();

    }

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">

            <div className="container">

                <Link
                    className="navbar-brand fw-bold fs-3"
                    to="/"
                >
                    🛒 ShopSecure
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    <ul className="navbar-nav me-auto align-items-center">

                        <li className="nav-item">

                            <NavLink
                                className="nav-link px-2"
                                to="/"
                            >
                                Home
                            </NavLink>

                        </li>

                        <li className="nav-item">

                            <NavLink
                                className="nav-link px-2"
                                to="/products"
                            >
                                Products
                            </NavLink>

                        </li>

                        {user && (

                            <li className="nav-item">

                                <NavLink
                                    className="nav-link px-2"
                                    to="/orders"
                                >
                                    Orders
                                </NavLink>

                            </li>

                        )}

                        {user && (

                            <li className="nav-item">

                                <NavLink
                                    className="nav-link px-2"
                                    to="/profile"
                                >
                                    Profile
                                </NavLink>

                            </li>

                        )}

                        {user?.role === "admin" && (

                            <li className="nav-item">

                                <NavLink
                                    className="nav-link px-2"
                                    to="/admin"
                                >
                                    Admin
                                </NavLink>

                            </li>

                        )}

                    </ul>

                    <form className="d-flex me-3">

                        <input
                            className="form-control"
                            style={{ width: "180px" }}
                            type="search"
                            placeholder="Search products..."
                        />

                        <button
                            className="btn btn-warning ms-2"
                            type="submit"
                        >
                            <FaSearch />
                        </button>

                    </form>

                    <Link
                        to="/cart"
                        className="btn btn-warning me-2"
                    >
                        <FaShoppingCart /> Cart
                    </Link>

                    {!user ? (

                        <>
                            <Link
                                to="/login"
                                className="btn btn-outline-light me-2"
                            >
                                <FaUserCircle /> Login
                            </Link>

                            <Link
                                to="/register"
                                className="btn btn-success"
                            >
                                Register
                            </Link>
                        </>

                    ) : (

                        <button
                            className="btn btn-danger"
                            onClick={logout}
                        >
                            Logout
                        </button>

                    )}

                </div>

            </div>

        </nav>

    );

}
