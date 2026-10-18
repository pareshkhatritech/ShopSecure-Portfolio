import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import "../styles/products.css";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadProducts() {
            try {
                setError("");
                const response = await api.get("/api/products");
                if (!ignore) setProducts(response.data);
            } catch (err) {
                if (!ignore) {
                    console.error("Products error:", err);
                    setError("Unable to load products.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadProducts();
        return () => { ignore = true; };
    }, []);

    const categories = useMemo(() => {
        const unique = [
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean)
            ),
        ];

        return ["All", ...unique];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch =
                !term ||
                product.name?.toLowerCase().includes(term) ||
                product.brand?.toLowerCase().includes(term) ||
                product.category?.toLowerCase().includes(term) ||
                product.description?.toLowerCase().includes(term);

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, category]);

    const clearFilters = () => {
        setSearch("");
        setCategory("All");
    };

    return (
        <main className="products-page">

            <div className="container">

                <div className="products-header">
                    <div>
                        <span className="products-label">
                            SHOPSECURE STORE
                        </span>

                        <h1>All Products</h1>

                        <p>
                            Find laptops, gaming equipment, monitors,
                            accessories and more.
                        </p>
                    </div>

                    <div className="products-count">
                        <strong>{filteredProducts.length}</strong>
                        <span>products</span>
                    </div>
                </div>

                <div className="products-toolbar">

                    <div className="product-search">
                        <span>🔎</span>

                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products, brands or categories..."
                            aria-label="Search products"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <select
                        className="category-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        aria-label="Select category"
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item === "All"
                                    ? "All Categories"
                                    : item}
                            </option>
                        ))}
                    </select>

                </div>

                <div className="category-bar">

                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={
                                category === item
                                    ? "category-button active"
                                    : "category-button"
                            }
                            onClick={() => setCategory(item)}
                        >
                            {item === "All"
                                ? "All Products"
                                : item}
                        </button>
                    ))}

                </div>

                {search && (
                    <div className="search-result">
                        Searching for:
                        <strong> "{search}"</strong>
                    </div>
                )}

                {loading && (
                    <div className="products-message">
                        Loading products...
                    </div>
                )}

                {!loading && error && (
                    <div className="products-message error">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    filteredProducts.length === 0 && (
                        <div className="products-empty">
                            <div className="empty-icon">🔍</div>

                            <h3>No products found</h3>

                            <p>
                                Try another search or category.
                            </p>

                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    filteredProducts.length > 0 && (
                        <div className="row products-grid">

                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="col-xl-3 col-lg-4 col-md-6 mb-4"
                                >
                                    <ProductCard
                                        product={product}
                                    />
                                </div>
                            ))}

                        </div>
                    )}

            </div>

        </main>
    );
}
