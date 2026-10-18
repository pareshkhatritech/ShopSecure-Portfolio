import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaTruck,
    FaLock,
    FaHeadset,
    FaArrowRight,
    FaBolt,
    FaStar
} from "react-icons/fa";

import api from "../api/api";
import Hero from "../components/Hero";
import PromoAds from "../components/PromoAds";
import ProductCard from "../components/ProductCard";

import "../styles/home.css";

export default function Home() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadProducts = async () => {

            try {

                const response = await api.get(
                    "/api/products?featured=true&limit=8"
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : [];

                setProducts(data.slice(0, 8));

            } catch (error) {

                console.error(
                    "Failed to load featured products:",
                    error
                );

                try {

                    const response = await api.get(
                        "/api/products"
                    );

                    const data = Array.isArray(response.data)
                        ? response.data
                        : [];

                    setProducts(
                        data
                            .filter(product =>
                                Number(product.featured) === 1
                            )
                            .slice(0, 8)
                    );

                } catch (fallbackError) {

                    console.error(
                        "Failed to load products:",
                        fallbackError
                    );

                }

            } finally {

                setLoading(false);

            }

        };

        loadProducts();

    }, []);

    return (
        <div className="home-page">

            {/* HERO */}
            <Hero />

            {/* FUTURISTIC PROMO */}
            <PromoAds />

            {/* FEATURED PRODUCTS */}
            <section className="featured-section">

                <div className="container">

                    <div className="section-heading">

                        <div>
                            <span className="section-kicker">
                                SHOPSECURE COLLECTION
                            </span>

                            <h2>
                                Featured <span>Products</span>
                            </h2>

                            <p>
                                Explore technology selected for
                                your next-generation lifestyle.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="view-all-btn"
                        >
                            View All Products
                            <FaArrowRight />
                        </Link>

                    </div>

                    {loading ? (

                        <div className="products-loading">
                            Loading products...
                        </div>

                    ) : products.length > 0 ? (

                        <div className="featured-grid">

                            {products.map(product => (

                                <div
                                    className="featured-product-item"
                                    key={product.id}
                                >
                                    <ProductCard
                                        product={product}
                                    />
                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="products-empty">
                            No featured products available.
                        </div>

                    )}

                </div>

            </section>

            {/* WHY SHOPSECURE */}
            <section className="why-section">

                <div className="why-background"></div>

                <div className="container">

                    <div className="why-heading">

                        <span className="section-kicker">
                            THE SHOPSECURE DIFFERENCE
                        </span>

                        <h2>
                            Built for the
                            <span> Future.</span>
                        </h2>

                        <p>
                            Everything you need for a smarter
                            and more secure shopping experience.
                        </p>

                    </div>

                    <div className="why-grid">

                        <div className="why-card">

                            <div className="why-icon">
                                <FaTruck />
                            </div>

                            <span className="why-number">
                                01
                            </span>

                            <h3>
                                Fast Delivery
                            </h3>

                            <p>
                                Get your technology delivered
                                quickly and reliably to your door.
                            </p>

                            <Link to="/products">
                                Explore
                                <FaArrowRight />
                            </Link>

                        </div>

                        <div className="why-card">

                            <div className="why-icon">
                                <FaLock />
                            </div>

                            <span className="why-number">
                                02
                            </span>

                            <h3>
                                Secure Shopping
                            </h3>

                            <p>
                                Your account and checkout are
                                protected with modern security.
                            </p>

                            <Link to="/products">
                                Shop Securely
                                <FaArrowRight />
                            </Link>

                        </div>

                        <div className="why-card">

                            <div className="why-icon">
                                <FaHeadset />
                            </div>

                            <span className="why-number">
                                03
                            </span>

                            <h3>
                                24/7 Support
                            </h3>

                            <p>
                                Our support experience is designed
                                to keep you moving without delays.
                            </p>

                            <Link to="/products">
                                Get Support
                                <FaArrowRight />
                            </Link>

                        </div>

                        <div className="why-card">

                            <div className="why-icon">
                                <FaBolt />
                            </div>

                            <span className="why-number">
                                04
                            </span>

                            <h3>
                                Future Technology
                            </h3>

                            <p>
                                Discover products selected for
                                modern digital lifestyles.
                            </p>

                            <Link to="/products">
                                Discover
                                <FaArrowRight />
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            {/* TRUST STRIP */}
            <section className="trust-section">

                <div className="container">

                    <div className="trust-grid">

                        <div className="trust-item">
                            <FaTruck />
                            <div>
                                <strong>
                                    Free Shipping
                                </strong>
                                <span>
                                    On orders over £100
                                </span>
                            </div>
                        </div>

                        <div className="trust-item">
                            <FaLock />
                            <div>
                                <strong>
                                    Secure Payment
                                </strong>
                                <span>
                                    100% secure checkout
                                </span>
                            </div>
                        </div>

                        <div className="trust-item">
                            <FaStar />
                            <div>
                                <strong>
                                    Quality Products
                                </strong>
                                <span>
                                    Carefully selected
                                </span>
                            </div>
                        </div>

                        <div className="trust-item">
                            <FaHeadset />
                            <div>
                                <strong>
                                    24/7 Support
                                </strong>
                                <span>
                                    Always here to help
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}
