const CartSummary = ({ items }) => {
  const subtotal = items.reduce(
    (total, item) => {
      return (
        total +
        item.product.price * item.quantity
      );
    },
    0
  );

  return (
    <section>
      <h2>Cart Summary</h2>

      <p>
        Subtotal: ${subtotal.toFixed(2)}
      </p>

      <p>
        Total: ${subtotal.toFixed(2)}
      </p>
    </section>
  );
};

export default CartSummary;