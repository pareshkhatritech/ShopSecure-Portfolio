import { NavLink } from "react-router-dom";

export default function AdminSidebar() {

    const linkClass = ({ isActive }) =>
        `nav-link text-white mb-2 ${
            isActive ? "bg-primary rounded" : ""
        }`;

    return (

        <div className="p-3">

            <h3 className="text-white mb-4">

                Admin Panel

            </h3>

            <nav className="nav flex-column">

                <NavLink
                    to="/admin/dashboard"
                    className={linkClass}
                >
                    📊 Dashboard
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={linkClass}
                >
                    👥 Users
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={linkClass}
                >
                    📦 Products
                </NavLink>

                <NavLink
                    to="/admin/orders"
                    className={linkClass}
                >
                    🛒 Orders
                </NavLink>

                <NavLink
                    to="/admin/analytics"
                    className={linkClass}
                >
                    📈 Analytics
                </NavLink>

            </nav>

        </div>

    );

}
