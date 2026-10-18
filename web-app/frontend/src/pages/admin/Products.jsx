import { useEffect, useState } from "react";

const API = "/api";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        image: ""
    });
    const [editingId, setEditingId] = useState(null);
    async function loadProducts(query = "") {

        try {

            const token = localStorage.getItem("token");

            let url = `${API}/admin/products`;

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

            setProducts(data);

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
                const response = await fetch(`${API}/admin/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    signal: controller.signal
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load products.");
                }

                setProducts(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Unable to load products.");
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

    async function saveProduct(e) {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const url = editingId
                ? `${API}/admin/products/${editingId}`
                : `${API}/admin/products`;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {

                method,

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(form)

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert(data.message);

            setForm({
                name: "",
                description: "",
                category: "",
                price: "",
                stock: "",
                image: ""
            });

            setEditingId(null);

            loadProducts(search);

        } catch (err) {

            alert(err.message);

        }

    }


    async function deleteProduct(id) {

        if (!window.confirm("Delete this product?")) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(

                `${API}/admin/products/${id}`,

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

            loadProducts(search);

        } catch (err) {

            alert(err.message);

        }

    }

    if (loading) {

        return <div className="container"><h3>Loading...</h3></div>;

    }

    return (

        <div className="container-fluid">

            <h2 className="mb-4">

                Product Management

            </h2>

            {error &&

                <div className="alert alert-danger">

                    {error}

                </div>

            }
            <div className="card mb-4">

                <div className="card-header">

                    <strong>Add Product</strong>

                </div>

                <div className="card-body">

                    <form onSubmit={saveProduct}>

                        <div className="row">

                            <div className="col-md-4 mb-3">
                                <input
                                    className="form-control"
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <input
                                    className="form-control"
                                    placeholder="Category"
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Price"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({ ...form, price: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Stock"
                                    value={form.stock}
                                    onChange={(e) =>
                                        setForm({ ...form, stock: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-8 mb-3">
                                <input
                                    className="form-control"
                                    placeholder="Image URL"
                                    value={form.image}
                                    onChange={(e) =>
                                        setForm({ ...form, image: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="col-12">

                                <button
                                    className="btn btn-success"
                                    type="submit"
                                >
                                    {editingId ? "Update Product" : "Add Product"}
                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

            <div className="d-flex mb-4">

                <input

                    className="form-control me-2"

                    placeholder="Search products..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                />

                <button

                    className="btn btn-primary"

                    onClick={() => loadProducts(search)}

                >

                    Search

                </button>

            </div>

            <table className="table table-bordered table-striped">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Category</th>

                        <th>Price</th>

                        <th>Stock</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {products.map(product => (

                        <tr key={product.id}>

                            <td>{product.id}</td>

                            <td>{product.name}</td>

                            <td>{product.category}</td>

                            <td>

                                £{Number(product.price).toFixed(2)}

                            </td>

                            <td>

                                <span

                                    className={

                                        product.stock < 5

                                            ? "badge bg-danger"

                                            : "badge bg-success"

                                    }

                                >

                                    {product.stock}

                                </span>

                            </td>

                            <td>


                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => {

                                        setEditingId(product.id);

                                        setForm({

                                            name: product.name,
                                            description: product.description,
                                            category: product.category,
                                            price: product.price,
                                            stock: product.stock,
                                            image: product.image

                                        });

                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });

                                    }}
                                >
                                    Edit
                                </button>

                                <button

                                    className="btn btn-danger btn-sm"

                                    onClick={() => deleteProduct(product.id)}

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
