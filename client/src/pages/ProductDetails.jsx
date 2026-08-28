import { useEffect, useState } from "react";
import { useParams, } from "react-router-dom";
import { getProductById } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      setError(null);

      await addItem(product._id, quantity);
      alert("Added to cart");
    } catch (error) {
      setError(error.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error && !product) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const outOfStock = product.inventory <= 0;

  return (
    <main>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      
      {/* Display error message banner if an error happens while adding to cart */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        {outOfStock
          ? "Out of stock"
          : `${product.inventory} available`}
      </p>

      {!outOfStock && (
        <>
          <input
            type="number"
            value={quantity}
            onChange={(event) => {
              const rawValue = event.target.value;
              if (rawValue === "") {
                setQuantity("");
                return;
              }
              const value = Number(rawValue);
              if (!isNaN(value)) {
                setQuantity(value);
              }
            }}
          />

          <button
            onClick={handleAddToCart}
            disabled={adding || quantity === ""}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </>
      )}
    </main>
  );
};

export default ProductDetails;
