import { createContext, useContext, useEffect, useState } from 'react';
import { 
  getCart, 
  getCartItems, 
  updateCartItems, 
  deleteItem, 
  clearCart 
} from '../api.js';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ buyer: null, items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      setCart(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      setError(null);
      const updatedCart = await getCartItems(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      setError(null);
      const updatedCart = await updateCartItems(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const removeItem = async (productId) => {
    try {
      setError(null);
      const updatedCart = await deleteItem(productId);
      setCart(updatedCart);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const emptyCart = async () => {
    try {
      setError(null);
      const updatedCart = await clearCart();
      setCart(updatedCart);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const value = {
    cart,
    loading,
    error,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    emptyCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};
