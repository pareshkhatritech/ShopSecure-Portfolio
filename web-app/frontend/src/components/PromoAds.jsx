import { Link } from "react-router-dom";
import { FaArrowRight, FaBolt, FaMicrochip } from "react-icons/fa";

export default function PromoAds() {
    return (
        <section className="future-promo-section">

            <div className="container">

                <div className="future-promo">

                    <div className="promo-grid"></div>

                    <div className="promo-glow"></div>

                    <div className="promo-content">

                        <span className="promo-label">
                            SHOPSECURE SPECIAL
                        </span>

                        <h2>
                            SMARTER.
                            <br />
                            <span>FASTER.</span>
                            <br />
                            BETTER.
                        </h2>

                        <p>
                            Premium technology at unbeatable prices.
                            Upgrade your setup and enter the future.
                        </p>

                        <div className="promo-offer">
                            <FaBolt />
                            <span>UP TO 40% OFF</span>
                        </div>

                        <Link
                            to="/products"
                            className="promo-button"
                        >
                            Shop The Future
                            <FaArrowRight />
                        </Link>

                    </div>

                    <div className="promo-visual">

                        <div className="promo-ring ring-one"></div>
                        <div className="promo-ring ring-two"></div>
                        <div className="promo-ring ring-three"></div>

                        <div className="promo-chip">
                            <FaMicrochip />
                        </div>

                        <div className="promo-circuit circuit-one"></div>
                        <div className="promo-circuit circuit-two"></div>
                        <div className="promo-circuit circuit-three"></div>

                        <div className="promo-orb"></div>

                        <div className="promo-tech-label label-one">
                            NEXT GEN
                        </div>

                        <div className="promo-tech-label label-two">
                            40% OFF
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}
