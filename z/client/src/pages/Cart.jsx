import { useCart } from "../context/CartContext.jsx";

import CartItem from "../components/CartItem.jsx";
import CartSummary from "../components/CartSummary.jsx";

const Cart = () => {
  const {
    cart,
    loading,
    error,
  } = useCart();


  if (loading) {
    return <p>Loading cart...</p>;
  }


  if (!cart.items || cart.items.length === 0) {
    return (
      <main>
        <h1>Your Cart</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>Your cart is empty.</p>
      </main>
    );
  }


  return (
    <main>
      <h1>Your Cart</h1>
      {error && <p style={{ color: "red", padding: "10px", backgroundColor: "#ffebeb", borderRadius: "4px" }}>{error}</p>}

      <section>
        {cart.items.map((item) => (
          <CartItem
            key={item.product._id}
            item={item}
          />
        ))}
      </section>

      <CartSummary
        items={cart.items}
      />
    </main>
  );
};

export default Cart;