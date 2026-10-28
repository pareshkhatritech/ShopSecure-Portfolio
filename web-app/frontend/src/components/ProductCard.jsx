
import { Link } from "react-router-dom";
import { useContext } from "react";
import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContextValue";

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const isDemoProduct = product.isDemoProduct === true;

    const discountedPrice =
        product.discount > 0
            ? (
                Number(product.price) -
                (Number(product.price) * Number(product.discount)) / 100
            ).toFixed(2)
            : Number(product.price).toFixed(2);

    const handleAddToCart = () => {
        if (isDemoProduct) return;
        addToCart(product);
    };

    return (
        <div
            className="card border-0 shadow-sm h-100"
            style={{
                transition: "0.3s",
                borderRadius: "15px",
                overflow: "hidden"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(0,0,0,.18)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                    "0 .125rem .25rem rgba(0,0,0,.075)";
            }}
        >
            <div
                className="position-relative"
                style={{
                    background: "#fff",
                    height: "230px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {product.discount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                        {product.discount}% OFF
                    </span>
                )}

                {!isDemoProduct && Number(product.featured) === 1 && (
                    <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                        Featured
                    </span>
                )}

                <img
                    src={
                        product.image ||
                        "https://via.placeholder.com/600x400?text=Product"
                    }
                    alt={product.name}
                    className="card-img-top"
                    style={{
                        width: "100%",
                        height: "230px",
                        objectFit: "contain",
                        padding: "15px"
                    }}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                            "https://via.placeholder.com/600x400?text=Product";
                    }}
                />
            </div>

            <div className="card-body d-flex flex-column">
                <small className="text-muted fw-bold">
                    {product.brand || product.category || "Product"}
                </small>

                <h5 className="mt-2">
                    {product.name}
                </h5>

                <div className="mb-2">
                    <FaStar className="text-warning" />

                    <span className="ms-1">
                        {product.rating ?? "N/A"}
                    </span>

                    <small className="text-muted ms-2">
                        ({product.reviews ?? 0} reviews)
                    </small>
                </div>

                {product.discount > 0 ? (
                    <>
                        <h4 className="text-danger">
                            £{discountedPrice}
                        </h4>

                        <del className="text-muted">
                            £{Number(product.price).toFixed(2)}
                        </del>
                    </>
                ) : (
                    <h4 className="text-primary">
                        £{Number(product.price).toFixed(2)}
                    </h4>
                )}

                {isDemoProduct && (
                    <small className="text-muted mb-2">
                        Demo product — not available for checkout.
                    </small>
                )}

                <div className="mt-auto">
                    <div className="d-grid gap-2">
                        {isDemoProduct ? (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                disabled
                            >
                                Demo Product
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="btn btn-dark"
                                >
                                    View Details
                                </Link>

                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={handleAddToCart}
                                >
                                    <FaShoppingCart className="me-1" />
                                    Add to Cart
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => {
                                alert("Wishlist functionality is not connected yet.");
                            }}
                        >
                            <FaHeart className="me-1" />
                            Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
