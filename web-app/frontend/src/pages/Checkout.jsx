import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useContext } from "react";
import { CartContext } from "../context/CartContextValue";

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, clearCart } = useContext(CartContext);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [address, setAddress] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postcode: ""
    });

    const [payment, setPayment] = useState({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const total = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    const updateAddress = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const updatePayment = (e) => {
        setPayment({
            ...payment,
            [e.target.name]: e.target.value
        });
    };

    const continueToPayment = (e) => {
        e.preventDefault();

        if (
            !address.fullName.trim() ||
            !address.email.trim() ||
            !address.phone.trim() ||
            !address.address.trim() ||
            !address.city.trim() ||
            !address.postcode.trim()
        ) {
            setError("Please complete all delivery details.");
            return;
        }

        setError("");
        setStep(2);
    };

    const placeOrder = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        const cleanCardNumber = payment.cardNumber.replace(/\D/g, "");

        if (
            !payment.cardName.trim() ||
            cleanCardNumber.length < 4 ||
            !payment.expiry.trim() ||
            !payment.cvv.trim()
        ) {
            setError("Please complete the demo payment details.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const items = cart.map((item) => ({
                product_id: item.id,
                quantity: Number(item.quantity)
            }));

            const response = await api.post(
                "/api/orders",
                {
                    items,

                    shipping_name: address.fullName.trim(),
                    shipping_email: address.email.trim(),
                    shipping_phone: address.phone.trim(),
                    shipping_address: address.address.trim(),
                    shipping_city: address.city.trim(),
                    shipping_postcode: address.postcode.trim(),

                    payment_method: "Demo Credit Card",

                    // Save ONLY the last 4 digits.
                    // Never send or save the full card number/CVV.
                    payment_last4: cleanCardNumber.slice(-4),

                    payment_status: "Paid",

                    payment_reference: `DEMO-${Date.now()}-${Math.floor(
                        Math.random() * 10000
                    )}`
                },
                {
                    headers: token
                        ? {
                              Authorization: `Bearer ${token}`
                          }
                        : {}
                }
            );

            clearCart();

            navigate("/orders", {
                state: {
                    message: response.data.message
                }
            });
        } catch (err) {
            console.error("Order error:", err);

            setError(
                err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Unable to place your order."
            );
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container py-5">
                <h2>Your cart is empty</h2>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/products")}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">
                Checkout
            </h2>

            <div className="row">
                <div className="col-md-8">
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={continueToPayment}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h4 className="mb-4">
                                        Delivery Address
                                    </h4>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-control"
                                            value={address.fullName}
                                            onChange={updateAddress}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={address.email}
                                            onChange={updateAddress}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Phone
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            className="form-control"
                                            value={address.phone}
                                            onChange={updateAddress}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            className="form-control"
                                            rows="3"
                                            value={address.address}
                                            onChange={updateAddress}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                City
                                            </label>

                                            <input
                                                type="text"
                                                name="city"
                                                className="form-control"
                                                value={address.city}
                                                onChange={updateAddress}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Postcode
                                            </label>

                                            <input
                                                type="text"
                                                name="postcode"
                                                className="form-control"
                                                value={address.postcode}
                                                onChange={updateAddress}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={placeOrder}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h4 className="mb-3">
                                        Demo Payment
                                    </h4>

                                    <div className="alert alert-warning">
                                        This is a demonstration payment form.
                                        Do not enter a real card number.
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Cardholder Name
                                        </label>

                                        <input
                                            type="text"
                                            name="cardName"
                                            className="form-control"
                                            value={payment.cardName}
                                            onChange={updatePayment}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Demo Card Number
                                        </label>

                                        <input
                                            type="text"
                                            name="cardNumber"
                                            className="form-control"
                                            placeholder="4111 1111 1111 1234"
                                            value={payment.cardNumber}
                                            onChange={updatePayment}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Expiry
                                            </label>

                                            <input
                                                type="text"
                                                name="expiry"
                                                className="form-control"
                                                placeholder="12/30"
                                                value={payment.expiry}
                                                onChange={updatePayment}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                CVV
                                            </label>

                                            <input
                                                type="password"
                                                name="cvv"
                                                className="form-control"
                                                placeholder="123"
                                                value={payment.cvv}
                                                onChange={updatePayment}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary me-2"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Processing..."
                                            : "Place Demo Order"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4>Order Summary</h4>

                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="d-flex justify-content-between border-bottom py-2"
                                >
                                    <span>
                                        {item.name} × {item.quantity}
                                    </span>

                                    <strong>
                                        £
                                        {(
                                            Number(item.price) *
                                            Number(item.quantity)
                                        ).toFixed(2)}
                                    </strong>
                                </div>
                            ))}

                            <hr />

                            <h4 className="d-flex justify-content-between">
                                <span>Total</span>
                                <span>£{total.toFixed(2)}</span>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
