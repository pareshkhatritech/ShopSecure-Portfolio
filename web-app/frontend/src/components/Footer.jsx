import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer bg-dark text-light mt-5">

      <div className="container py-5">

        <div className="row">

          <div className="col-lg-4 mb-4">

            <h3 className="fw-bold text-warning">
              ShopSecure
            </h3>

            <p>
              ShopSecure is an enterprise e-commerce platform built for
              penetration testing, secure development, and modern web
              technologies.
            </p>

          </div>

          <div className="col-lg-2 mb-4">

            <h5>Quick Links</h5>

            <ul className="list-unstyled">

              <li><Link to="/">Home</Link></li>

              <li><Link to="/products">Products</Link></li>

              <li><Link to="/cart">Cart</Link></li>

              <li><Link to="/orders">Orders</Link></li>

            </ul>

          </div>

          <div className="col-lg-3 mb-4">

            <h5>Support</h5>

            <ul className="list-unstyled">

              <li>Email</li>

              <li>FAQs</li>

              <li>Returns</li>

              <li>Privacy Policy</li>

            </ul>

          </div>

          <div className="col-lg-3">

            <h5>Follow Us</h5>

            <div className="social-icons">

              <a href="#"><FaFacebook /></a>

              <a href="#"><FaTwitter /></a>

              <a href="#"><FaInstagram /></a>

              <a href="#"><FaLinkedin /></a>

            </div>

          </div>

        </div>

        <hr />

        <div className="text-center">
          © 2026 ShopSecure | Enterprise PenTest Project
        </div>

      </div>

    </footer>
  );
}
