import { useEffect, useState } from "react";

const API = "/api";

export default function Users() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadUsers(query = "") {

        try {

            const token = localStorage.getItem("token");

            let url = `${API}/admin/users`;

            if (query) {
                url += `?search=${encodeURIComponent(query)}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setUsers(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {
        const controller = new AbortController();

        async function fetchInitialData() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API}/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    signal: controller.signal
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load users.");
                }

                setUsers(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Unable to load users.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void fetchInitialData();
        return () => controller.abort();
    }, []);

    async function updateRole(user) {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(

                `${API}/admin/users/${user.id}/role`,

                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        role: user.role
                    })

                }

            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert(data.message);

            loadUsers(search);

        } catch (err) {

            alert(err.message);

        }

    }

    async function deleteUser(user) {

        if (!window.confirm(`Delete ${user.username}?`)) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(

                `${API}/admin/users/${user.id}`,

                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                }

            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert(data.message);

            loadUsers(search);

        } catch (err) {

            alert(err.message);

        }

    }

    if (loading) {
        return <h3>Loading users...</h3>;
    }

    return (

        <div className="container-fluid">

            <h2 className="mb-4">

                User Management

            </h2>

            {error &&
                <div className="alert alert-danger">
                    {error}
                </div>
            }

            <div className="d-flex mb-4">

                <input
                    className="form-control me-2"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    className="btn btn-primary"
                    onClick={() => loadUsers(search)}
                >
                    Search
                </button>

            </div>

            <table className="table table-bordered table-striped">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {users.map(user => (

                        <tr key={user.id}>

                            <td>{user.id}</td>

                            <td>{user.username}</td>

                            <td>{user.email}</td>

                            <td>

                                <div className="d-flex">

                                    <select

                                        className="form-select me-2"

                                        value={user.role}

                                        onChange={(e) => {

                                            setUsers(

                                                users.map(u =>

                                                    u.id === user.id

                                                        ? {
                                                            ...u,
                                                            role: e.target.value
                                                        }

                                                        : u

                                                )

                                            );

                                        }}

                                    >

                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>

                                    </select>

                                    <button

                                        className="btn btn-success"

                                        onClick={() => updateRole(user)}

                                    >

                                        Save

                                    </button>

                                </div>

                            </td>

                            <td>

                                {new Date(
                                    user.created_at
                                ).toLocaleDateString("en-GB")}

                            </td>

                            <td>

                                <button

                                    className="btn btn-danger"

                                    onClick={() => deleteUser(user)}

                                >

                                    Delete

                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}
