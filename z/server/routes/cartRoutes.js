import express from "express";
import {
  getCart as getCartController,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart as clearCartController,
} from "../controllers/cartController.js";

// Make sure you import both requireAuth AND authorize
import { authenticate } from "../middleware/authenticate.js"; 
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// 1. Authenticate user first (attaches req.user)
router.use(authenticate);

// 2. Authorize allowed roles (pass explicitly)
router.use(authorize("BUYER", "SELLER")); 

router.get("/", getCartController);
router.post("/items", addToCart);
router.patch("/items/:productId", updateCartItem);
router.delete("/items/:productId", removeFromCart);
router.delete("/", clearCartController);

export default router;