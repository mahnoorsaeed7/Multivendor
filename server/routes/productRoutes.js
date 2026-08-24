import express from "express";
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  getMyProducts, 
  updateProduct, 
  archiveProduct 
} from "../controllers/productController.js"; 

import { authenticate } from "../middleware/authenticate.js"; 
import { authorize } from "../middleware/authorize.js"; 

const router = express.Router();

router.get("/", getProducts); 
router.get("/my", authenticate, authorize("SELLER"), getMyProducts); 
router.get("/:id", getProductById); 

router.post("/", authenticate, authorize("SELLER"), createProduct); 
router.patch("/:id", authenticate, authorize("SELLER"), updateProduct); 
router.delete("/:id", authenticate, authorize("SELLER"), archiveProduct); 

export default router;