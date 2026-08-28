import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {

  try {
    let cart = await Cart.findOne({ buyer: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({
        buyer: req.user._id,
        items: [],
      });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('getCart error:', error);
    return res.status(500).json({
      message: 'Failed to fetch cart',
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.status !== 'active') {
      return res.status(400).json({ message: 'Product is not available' });
    }

    if (product.inventory < quantity) {
      return res.status(400).json({ message: 'Requested quantity exceeds available inventory' });
    }

    let cart = await Cart.findOne({ buyer: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        buyer: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.inventory) {
        return res.status(400).json({ message: 'Requested quantity exceeds available inventory' });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    return res.status(200).json(cart);
  } catch (error) {
    console.error('addToCart error:', error);
    return res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.status !== 'active') {
      return res.status(400).json({ message: 'Product is not available' });
    }

    if (quantity > product.inventory) {
      return res.status(400).json({ message: 'Requested quantity exceeds available inventory' });
    }

    const cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate('items.product');

    return res.status(200).json(cart);
  } catch (error) {
    console.error('updateCartItem error:', error);
    return res.status(500).json({ message: 'Failed to update cart item' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cart.save();
    await cart.populate('items.product');

    return res.status(200).json(cart);
  } catch (error) {
    console.error('removeFromCart error:', error);
    return res.status(500).json({ message: 'Failed to remove cart item' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ buyer: req.user._id });

    if (!cart) {
      return res.status(200).json({
        buyer: req.user._id,
        items: [],
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error('clearCart error:', error);
    return res.status(500).json({ message: 'Failed to clear cart' });
  }
};