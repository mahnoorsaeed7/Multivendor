import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/public", (req, res) => {
  res.json({
    message: "Anyone can access this route",
  });
});

router.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get(
  "/buyer",
  authenticate,
  authorize("buyer"),
  (req, res) => {
    res.json({
      message: "Buyer route",
    });
  }
);

router.get(
  "/seller",
  authenticate,
  authorize("seller"),
  (req, res) => {
    res.json({
      message: "Seller route",
    });
  }
);

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Admin route",
    });
  }
);

router.get(
  "/seller-or-admin",
  authenticate,
  authorize("seller", "admin"),
  (req, res) => {
    res.json({
      message: "Seller or admin route",
    });
  }
);

export default router;