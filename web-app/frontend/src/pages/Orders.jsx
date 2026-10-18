import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/api/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setOrders(response.data);
		console.log(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-success";
            case "cancelled":
                return "bg-danger";
            case "processing":
                return "bg-warning text-dark";
            default:
                return "bg-primary";
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <h3>Loading orders...</h3>
            </div>
        );
    }

    return (
        <div className="container py-5">

            <h2 className="mb-4">
                <i className="bi bi-bag-check me-2"></i>
                My Orders
            </h2>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="alert alert-info">
                    No orders found.
                </div>
            ) : (
                orders.map((order) => (
                    <div
                        key={order.id}
                        className="card shadow-sm mb-4 border-0"
                    >
                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>
                                    <h5 className="mb-1">
                                        Order #{order.id}
                                    </h5>

                                    <small className="text-muted">
                                        {new Date(order.created_at).toLocaleString()}
                                    </small>
                                </div>

                                <span className={`badge ${getBadgeClass(order.status)}`}>
                                    {order.status}
                                </span>

                            </div>

                            <hr />

                            <div className="row">

                                <div className="col-md-4">
                                    <strong>Total</strong>
                                    <p className="mb-0">
                                        £{Number(order.total).toFixed(2)}
                                    </p>
                                </div>

                                <div className="col-md-4">
                                    <strong>Items</strong>
                                    <p className="mb-0">
                                        {order.item_count}
                                    </p>
                                </div>

                                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="btn btn-outline-primary"
                                    >
                                        View Details
                                    </Link>
                                </div>

                            </div>

                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
