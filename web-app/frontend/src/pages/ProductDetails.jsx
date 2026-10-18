import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { CartContext } from "../context/CartContextValue";
import "../styles/productDetails.css";

export default function ProductDetails() {

    const { id } = useParams();
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function loadProduct() {
            setLoading(true);
            setProduct(null);

            try {
                const response = await api.get(`/api/products/${id}`);
                if (!ignore) setProduct(response.data);
            } catch (err) {
                if (!ignore) console.error(err);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadProduct();
        return () => { ignore = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="container mt-5">
                <h3>Loading...</h3>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mt-5">
                <h3>Product not found</h3>
            </div>
        );
    }

    return (

        <div className="container mt-5">

            <div className="row">

                <div className="col-md-6">

                    <img
                        src={product.image || "/images/products/default.jpg"}
                        alt={product.name}
                        className="img-fluid rounded shadow"
                    />

                </div>

                <div className="col-md-6">

                    <h2>{product.name}</h2>

                    <p className="text-muted">
                        {product.category}
                    </p>

                    <h3 className="text-primary">
                        £{product.price}
                    </h3>

                    <p className="mt-3">
                        {product.description}
                    </p>

                    <p>
                        <strong>Stock:</strong> {product.stock}
                    </p>

                    <button
                        className="btn btn-warning btn-lg me-3"
                        onClick={() => addToCart(product)}
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </div>

    );

}
