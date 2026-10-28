
import { useEffect, useState } from "react";
import api from "../api/api";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You are not logged in. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setProfile(response.data);
            } catch (err) {
                console.error(
                    "Profile request failed:",
                    err.response?.data || err.message
                );

                if (err.response?.status === 401) {
                    setError("Your session has expired. Please log in again.");
                } else if (err.response?.status === 404) {
                    setError(
                        "The profile endpoint was not found. Please check the backend profile route."
                    );
                } else {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load your profile. Please try again."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="container py-5">
                <h4>Loading profile...</h4>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    No profile information was returned by the server.
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">
                <i className="bi bi-person-circle me-2"></i>
                My Profile
            </h2>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <h5>Account Information</h5>
                            <hr />

                            <p>
                                <strong>Username</strong>
                                <br />
                                {profile.username || "Not available"}
                            </p>

                            <p>
                                <strong>Email</strong>
                                <br />
                                {profile.email || "Not available"}
                            </p>

                            <p>
                                <strong>Member Since</strong>
                                <br />
                                {profile.created_at
                                    ? new Date(
                                          profile.created_at
                                      ).toLocaleDateString("en-GB")
                                    : "Not available"}
                            </p>
                        </div>

                        <div className="col-md-6">
                            <h5>Account Summary</h5>
                            <hr />

                            <div className="row text-center">
                                <div className="col-4">
                                    <h3>
                                        {profile.total_orders ?? 0}
                                    </h3>
                                    <small>Total Orders</small>
                                </div>

                                <div className="col-4">
                                    <h3>
                                        {profile.items_purchased ?? 0}
                                    </h3>
                                    <small>Items Purchased</small>
                                </div>

                                <div className="col-4">
                                    <h3>
                                        £{Number(
                                            profile.total_spent ?? 0
                                        ).toFixed(2)}
                                    </h3>
                                    <small>Total Spent</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
