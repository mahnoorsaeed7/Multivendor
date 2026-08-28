import { useCart } from "../context/CartContext.jsx";

const CartItem = ({ item }) => {
  const {
    updateItem,
    removeItem,
  } = useCart();

  const product = item.product;

  const handleQuantityChange = async (event) => {
    const quantity = Number(event.target.value);

    if (!Number.isInteger(quantity)) {
      return;
    }

    try {
      await updateItem(
        product._id,
        quantity
      );
    } catch (error) {
      console.error(error);
    }
  };


  const handleRemove = async () => {
    try {
      await removeItem(product._id);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <article>
      <h3>{product.title}</h3>

      <p>
        Price: ${product.price}
      </p>

      <label>
        Quantity:

        <input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
        />
      </label>

      <p>
        Item subtotal: $
        {(
          product.price *
          item.quantity
        ).toFixed(2)}
      </p>

      <button onClick={handleRemove}>
        Remove
      </button>
    </article>
  );
};

export default CartItem;