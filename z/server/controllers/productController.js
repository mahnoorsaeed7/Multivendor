import mongoose from "mongoose";
import Product from "../models/Product.js";

// ======================================================
// CREATE PRODUCT
// POST /api/products | SELLER ONLY
// ======================================================
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, inventory, category } = req.body;
    const seller = req.user._id;

    const product = await Product.create({
      seller,
      title,
      description,
      price,
      inventory,
      category,
      status: "active"
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("createProduct error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }
    return res.status(500).json({ success: false, message: "Failed to create product" });
  }
};

// ======================================================
// GET ALL ACTIVE PRODUCTS
// GET /api/products | PUBLIC
// ======================================================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" })
      .select("-__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// ======================================================
// GET ONE PRODUCT
// GET /api/products/:id | PUBLIC
// ======================================================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findOne({ _id: id, status: "active" }).select("-__v");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("getProductById error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

// ======================================================
// GET SELLER'S OWN PRODUCTS
// GET /api/products/my | SELLER ONLY
// ======================================================
export const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("getMyProducts error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch seller products" });
  }
};

// ======================================================
// UPDATE PRODUCT
// PATCH /api/products/:id | SELLER ONLY + OWNERSHIP
// ======================================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (!product.seller.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "You do not own this product" });
    }

    if (product.status === "archived") {
      return res.status(400).json({ 
        success: false, 
        message: "Archived products cannot be updated. Please recreate the product instead." 
      });
    }

    const allowedFields = ["title", "description", "price", "inventory", "category"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }
    return res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// ======================================================
// ARCHIVE PRODUCT
// DELETE /api/products/:id | SELLER ONLY + OWNERSHIP
// ======================================================
export const archiveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, seller: req.user._id },
      { status: "archived" },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product archived successfully",
      data: product,
    });
  } catch (error) {
    console.error("archiveProduct error:", error);
    return res.status(500).json({ success: false, message: "Failed to archive product" });
  }
};