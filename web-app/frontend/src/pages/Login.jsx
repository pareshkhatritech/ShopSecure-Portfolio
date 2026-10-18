import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import api from "../api/api";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (e) => {
        e.preventDefault();
        setError("");

        if (!captchaToken) {
            setError("Please complete the security verification.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/api/login", {
                email,
                password,
                turnstileToken: captchaToken
            });

            localStorage.setItem("token", response.data.token);

            const destination = location.state?.from || "/";

            navigate(destination, { replace: true });
        } catch (error) {
            console.error(error);

            setCaptchaToken("");

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container mt-5 mb-5"
            style={{ maxWidth: "450px" }}
        >
            <div className="card shadow border-0">
                <div className="card-body p-4 p-md-5">

                    <h2 className="text-center mb-2">
                        ShopSecure Login
                    </h2>

                    <p className="text-center text-muted mb-4">
                        Sign in securely to your account
                    </p>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={login}>

                        <div className="mb-3">
                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
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
                            disabled={
                                loading || !captchaToken
                            }
                        >
                            {loading
                                ? "Signing in..."
                                : "Login"}
                        </button>

                    </form>

                    <div className="text-center mt-4">
                        <span>
                            Don't have an account?
                        </span>

                        <Link
                            to="/register"
                            className="ms-2"
                        >
                            Register
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
