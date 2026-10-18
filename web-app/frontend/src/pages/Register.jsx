import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import api from "../api/api";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [captchaToken, setCaptchaToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const register = async (e) => {
        e.preventDefault();
        setError("");

        if (!captchaToken) {
            setError("Please complete the security verification.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/api/register", {
                ...form,
                turnstileToken: captchaToken
            });

            navigate("/login");
        } catch (err) {
            setCaptchaToken("");

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container mt-5 mb-5"
            style={{ maxWidth: "500px" }}
        >
            <div className="card shadow border-0">
                <div className="card-body p-4 p-md-5">

                    <h2 className="mb-2 text-center">
                        Create Account
                    </h2>

                    <p className="text-center text-muted mb-4">
                        Create your ShopSecure account
                    </p>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={register}>

                        <div className="mb-3">
                            <label className="form-label">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                                required
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
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="mb-4 d-flex justify-content-center">
                            <Turnstile
                                siteKey={
                                    import.meta.env
                                        .VITE_TURNSTILE_SITE_KEY
                                }
                                onSuccess={(token) => {
                                    setCaptchaToken(token);
                                    setError("");
                                }}
                                onExpire={() => {
                                    setCaptchaToken("");
                                }}
                                onError={() => {
                                    setCaptchaToken("");
                                    setError(
                                        "Security verification failed."
                                    );
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading || !captchaToken}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Register"}
                        </button>

                    </form>

                    <div className="text-center mt-4">
                        Already have an account?

                        <Link
                            className="ms-2"
                            to="/login"
                        >
                            Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
