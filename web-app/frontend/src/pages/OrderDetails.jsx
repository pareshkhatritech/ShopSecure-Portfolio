import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";



function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load order.");
        }

        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading order...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>

        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/orders")}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const totalItems = order.items.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  return (
    <div className="container mt-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/orders")}
      >
        ← Back to Orders
      </button>

      <div className="card shadow-sm">
        <div className="card-header">
          <h2 className="mb-0">Order #{order.id}</h2>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <strong>Status</strong>
              <p>{order.status}</p>
            </div>

            <div className="col-md-3">
              <strong>Date</strong>
              <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>

            <div className="col-md-3">
              <strong>Items</strong>
              <p>{totalItems}</p>
            </div>

            <div className="col-md-3">
              <strong>Total</strong>
              <p>£{Number(order.total).toFixed(2)}</p>
            </div>
          </div>

          <hr />

          <h4>Purchased Items</h4>

          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>£{Number(item.price).toFixed(2)}</td>
                  <td>
                    £{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end">
            <h4>Total: £{Number(order.total).toFixed(2)}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
