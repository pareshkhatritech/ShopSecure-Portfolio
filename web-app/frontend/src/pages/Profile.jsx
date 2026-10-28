import { useEffect, useState } from "react";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setError("You are not logged in.");
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(
    "https://YOUR-RENDER-BACKEND-URL/api/profile",
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

const contentType = response.headers.get("content-type") || "";

if (!contentType.includes("application/json")) {
    throw new Error("The backend did not return JSON. Check the API URL and backend deployment.");
}

const data = await response.json();

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load profile.");
                }

                setProfile(data);

            } catch (err) {

                console.error(err);
                setError(err.message);

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
                                {profile.username}
                            </p>

                            <p>
                                <strong>Email</strong>
                                <br />
                                {profile.email}
                            </p>

                            <p>
                                <strong>Member Since</strong>
                                <br />
                                {new Date(profile.created_at).toLocaleDateString("en-GB")}
                            </p>

                        </div>

                        <div className="col-md-6">

                            <h5>Account Summary</h5>

                            <hr />

                            <div className="row text-center">

                                <div className="col-4">
                                    <h3>{profile.total_orders}</h3>
                                    <small>Total Orders</small>
                                </div>

                                <div className="col-4">
                                    <h3>{profile.items_purchased}</h3>
                                    <small>Items Purchased</small>
                                </div>

                                <div className="col-4">
                                    <h3>
                                        £{Number(profile.total_spent).toFixed(2)}
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
