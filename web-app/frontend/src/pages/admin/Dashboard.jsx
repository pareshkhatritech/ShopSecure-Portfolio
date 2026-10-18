import { useEffect, useState } from "react";

export default function Dashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API = "/api";

    useEffect(() => {

        async function loadDashboard() {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API}/admin/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setStats(data);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);

    if (loading) {

        return (
            <div className="container py-5">
                <h3>Loading dashboard...</h3>
            </div>
        );

    }

    if (error) {

        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );

    }

    return (

        <div className="container-fluid">

            <h2 className="mb-4">
                Admin Dashboard
            </h2>

            <div className="row">

                <div className="col-md-3 mb-4">

                    <div className="card shadow-sm text-center">

                        <div className="card-body">

                            <h2>{stats.total_users}</h2>

                            <p>Total Users</p>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div className="card shadow-sm text-center">

                        <div className="card-body">

                            <h2>{stats.total_products}</h2>

                            <p>Total Products</p>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div className="card shadow-sm text-center">

                        <div className="card-body">

                            <h2>{stats.total_orders}</h2>

                            <p>Total Orders</p>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-4">

                    <div className="card shadow-sm text-center">

                        <div className="card-body">

                            <h2>
                                £{Number(stats.total_sales).toFixed(2)}
                            </h2>

                            <p>Total Sales</p>

                        </div>

                    </div>

                </div>

            </div>

            <div className="card shadow-sm mt-4">

                <div className="card-header">

                    <strong>Quick Actions</strong>

                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-4 mb-3">

                            <div className="card border-primary">

                                <div className="card-body text-center">

                                    <h5>👥 Users</h5>

                                    <p>Manage user accounts and roles.</p>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-4 mb-3">

                            <div className="card border-success">

                                <div className="card-body text-center">

                                    <h5>📦 Products</h5>

                                    <p>Add, edit, and delete products.</p>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-4 mb-3">

                            <div className="card border-warning">

                                <div className="card-body text-center">

                                    <h5>🛒 Orders</h5>

                                    <p>Review and update customer orders.</p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
