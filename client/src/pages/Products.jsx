import { useEffect, useState } from "react";
import { getProducts } from "../api.js"; // Aligned with your services folder structure
import ProductCard from "../components/ProductCard.jsx"; // Extension omitted for standard bundler handling

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return product.title.toLowerCase().includes(query);
  });

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <section style={{ marginTop: "30px" }}>
      <h2>Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />

      {filteredProducts.length === 0 ? (
        <p>No products found matching "{search}".</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Products;
