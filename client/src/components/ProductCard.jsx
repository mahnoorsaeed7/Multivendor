import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const outOfStock =
    product.inventory <= 0;

  return (
    <article>
      <h2>{product.title}</h2>

      <p>
        ${product.price}
      </p>

      <p>
        {outOfStock
          ? "Out of stock"
          : `${product.inventory} available`}
      </p>

      <Link
        to={`/products/${product._id}`}
      >
        View Details
      </Link>
    </article>
  );
};

export default ProductCard;