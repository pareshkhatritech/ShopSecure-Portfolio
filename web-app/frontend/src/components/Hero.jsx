import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaShieldAlt,
    FaRocket,
    FaHeadset
} from "react-icons/fa";

export default function Hero() {
    return (
        <section className="future-hero">

            <div className="future-grid"></div>

            <div className="future-glow glow-one"></div>
            <div className="future-glow glow-two"></div>

            <div className="container future-hero-content">

                <div className="future-hero-text">

                    <span className="future-badge">
                        ✦ WELCOME TO THE FUTURE
                    </span>

                    <h1>
                        Next-Gen
                        <br />
                        <span>Tech.</span>
                        <br />
                        Limitless
                        <br />
                        <span>Possibilities.</span>
                    </h1>

                    <p>
                        Discover premium technology designed for a
                        smarter, faster and more connected future.
                    </p>

                    <div className="future-buttons">

                        <Link
                            to="/products"
                            className="future-btn primary"
                        >
                            Shop Now
                            <FaArrowRight />
                        </Link>

                        <Link
                            to="/products"
                            className="future-btn secondary"
                        >
                            Explore Products
                        </Link>

                    </div>

                </div>

                <div className="future-hero-visual">

                    <div className="future-portal"></div>

                    <div className="orbit orbit-one"></div>
                    <div className="orbit orbit-two"></div>

                    <div className="future-city">

                        <div className="city-building building-one"></div>
                        <div className="city-building building-two"></div>
                        <div className="city-building building-three"></div>
                        <div className="city-building building-four"></div>
                        <div className="city-building building-five"></div>

                    </div>

                    <div className="future-core">
                        ◈
                    </div>

                    <div className="future-light light-one"></div>
                    <div className="future-light light-two"></div>
                    <div className="future-light light-three"></div>

                </div>

            </div>

            <div className="container future-benefits">

                <div className="future-benefit">
                    <FaShieldAlt />
                    <div>
                        <strong>Secure Payments</strong>
                        <small>100% protected checkout</small>
                    </div>
                </div>

                <div className="future-benefit">
                    <FaRocket />
                    <div>
                        <strong>Fast Delivery</strong>
                        <small>Quick delivery to your door</small>
                    </div>
                </div>

                <div className="future-benefit">
                    <FaHeadset />
                    <div>
                        <strong>24/7 Support</strong>
                        <small>We're here to help</small>
                    </div>
                </div>

            </div>

        </section>
    );
}
