import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContextValue";

export default function Cart() {

    const {
        cart,
        removeFromCart,
        increaseQty,
        decreaseQty
    } = useContext(CartContext);

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    const shipping = subtotal > 0 ? 9.99 : 0;

    const total = subtotal + shipping;

    return (

        <div className="container py-5">

            <h2 className="mb-4">
                <i className="bi bi-cart3 me-2"></i>
                Shopping Cart
            </h2>

            {cart.length === 0 ? (

                <div className="text-center mt-5">

                    <i
                        className="bi bi-cart-x"
                        style={{ fontSize: "80px", color: "#999" }}
                    ></i>

                    <h3 className="mt-3">
                        Your cart is empty
                    </h3>

                    <p className="text-muted">
                        Looks like you haven't added anything yet.
                    </p>

                    <Link
                        to="/products"
                        className="btn btn-primary btn-lg"
                    >
                        Continue Shopping
                    </Link>

                </div>

            ) : (

                <div className="row">

                    <div className="col-lg-8">

                        {cart.map(item => (

                            <div
                                key={item.id}
                                className="card shadow-sm mb-3"
                            >

                                <div className="row g-0">

                                    <div className="col-md-3">

                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="img-fluid rounded-start"
                                            style={{
                                                height: "180px",
                                                objectFit: "cover",
                                                width: "100%"
                                            }}
                                        />

                                    </div>

                                    <div className="col-md-9">

                                        <div className="card-body">

                                            <h5>{item.name}</h5>

                                            <p className="text-muted">
                                                {item.category}
                                            </p>

                                            <h4 className="text-primary">
                                                £{Number(item.price).toFixed(2)}
                                            </h4>

                                            <div className="d-flex align-items-center mt-3">

                                                <button
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => decreaseQty(item.id)}
                                                >
                                                    -
                                                </button>

                                                <span
                                                    className="mx-3 fw-bold"
                                                    style={{ minWidth: "30px", textAlign: "center" }}
                                                >
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => increaseQty(item.id)}
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <div className="mt-4 d-flex justify-content-between align-items-center">

                                                <strong>
                                                    Item Total:
                                                    {" "}
                                                    £{(
                                                        Number(item.price) *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </strong>

                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                    {" "}
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="col-lg-4">

                        <div className="card shadow">

                            <div className="card-body">

                                <h3 className="mb-4">
                                    Order Summary
                                </h3>

                                <div className="d-flex justify-content-between">

                                    <span>Subtotal</span>

                                    <strong>
                                        £{subtotal.toFixed(2)}
                                    </strong>

                                </div>

                                <hr />

                                <div className="d-flex justify-content-between">

                                    <span>Shipping</span>

                                    <strong>
                                        £{shipping.toFixed(2)}
                                    </strong>

                                </div>

                                <hr />

                                <div className="d-flex justify-content-between">

                                    <h4>Total</h4>

                                    <h4 className="text-success">
                                        £{total.toFixed(2)}
                                    </h4>

                                </div>

                                <div className="mt-4">

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Coupon Code"
                                    />

                                    <button
                                        className="btn btn-outline-primary w-100 mt-3"
                                    >
                                        Apply Coupon
                                    </button>

                                </div>

                                <Link
                                    to="/checkout"
                                    className="btn btn-success btn-lg w-100 mt-4"
                                >
                                    <i className="bi bi-credit-card me-2"></i>
                                    Proceed to Checkout
                                </Link>

                                <Link
                                    to="/products"
                                    className="btn btn-outline-dark w-100 mt-3"
                                >
                                    Continue Shopping
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}
