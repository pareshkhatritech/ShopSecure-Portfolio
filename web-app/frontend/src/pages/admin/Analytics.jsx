import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_API_URL}/api`;
export default function Analytics() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadAnalytics() {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API}/admin/analytics`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const analytics = await response.json();

                if (!response.ok) {
                    throw new Error(analytics.message);
                }

                setData(analytics);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }

        }

        loadAnalytics();

    }, []);

    if (loading) {
        return <h3>Loading analytics...</h3>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (

        <div className="container-fluid">

            <h2 className="mb-4">
                Analytics Dashboard
            </h2>

            <div className="row mb-5">

                <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h2>{data.total_users}</h2>
                            <p>Total Users</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h2>{data.total_products}</h2>
                            <p>Total Products</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h2>{data.total_orders}</h2>
                            <p>Total Orders</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <h2>£{Number(data.total_sales).toFixed(2)}</h2>
                            <p>Total Sales</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="row">

                <div className="col-md-6">

                    <div className="card shadow-sm">

                        <div className="card-header">

                            Recent Orders

                        </div>

                        <div className="card-body">

                            <table className="table">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Status</th>
                                        <th>Total</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {data.recent_orders.map(order => (

                                        <tr key={order.id}>

                                            <td>{order.id}</td>

                                            <td>{order.status}</td>

                                            <td>
                                                £{Number(order.total).toFixed(2)}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card shadow-sm">

                        <div className="card-header">

                            Low Stock Products

                        </div>

                        <div className="card-body">

                            <table className="table">

                                <thead>

                                    <tr>

                                        <th>Name</th>
                                        <th>Stock</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {data.low_stock.map(product => (

                                        <tr key={product.id}>

                                            <td>{product.name}</td>

                                            <td>

                                                <span className="badge bg-danger">

                                                    {product.stock}

                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
