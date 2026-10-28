import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_API_URL}/api`;
export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadOrders(query = "") {

        try {

            const token = localStorage.getItem("token");

            let url = `${API}/admin/orders`;

            if (query) {
                url += `?search=${encodeURIComponent(query)}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setOrders(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {
        const controller = new AbortController();

        async function fetchInitialOrders() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API}/admin/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    signal: controller.signal
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load orders.");
                }

                setOrders(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Unable to load orders.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void fetchInitialOrders();

        return () => controller.abort();
    }, []);

    async function updateStatus(order) {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API}/admin/orders/${order.id}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: order.status
                    })

                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert(data.message);

            loadOrders(search);

        } catch (err) {

            alert(err.message);

        }

    }

    if (loading) {

        return <div className="container"><h3>Loading...</h3></div>;

    }

    return (

        <div className="container-fluid">

            <h2 className="mb-4">

                Order Management

            </h2>

            {error &&
                <div className="alert alert-danger">
                    {error}
                </div>
            }

            <div className="d-flex mb-4">

                <input
                    className="form-control me-2"
                    placeholder="Search customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    className="btn btn-primary"
                    onClick={() => loadOrders(search)}
                >
                    Search
                </button>

            </div>

            <table className="table table-bordered table-striped">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Save</th>

                    </tr>

                </thead>

                <tbody>

                    {orders.map(order => (

                        <tr key={order.id}>

                            <td>{order.id}</td>

                            <td>{order.username}</td>

                            <td>{order.email}</td>

                            <td>

                                £{Number(order.total).toFixed(2)}

                            </td>

                            <td>

                                <select
                                    className="form-select"

                                    value={order.status}

                                    onChange={(e) => {

                                        setOrders(

                                            orders.map(o =>

                                                o.id === order.id

                                                    ? {
                                                        ...o,
                                                        status: e.target.value
                                                    }

                                                    : o

                                            )

                                        );

                                    }}
                                >

                                    <option>Pending</option>

                                    <option>Processing</option>

                                    <option>Completed</option>

                                    <option>Cancelled</option>

                                </select>

                            </td>

                            <td>

                                {new Date(
                                    order.created_at
                                ).toLocaleDateString("en-GB")}

                            </td>

                            <td>

                                <button

                                    className="btn btn-success btn-sm"

                                    onClick={() => updateStatus(order)}

                                >

                                    Save

                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}
