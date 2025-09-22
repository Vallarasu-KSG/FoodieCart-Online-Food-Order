import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controllers/OrderController.js";

const orderRouter = express.Router();

// Place order
orderRouter.post("/place", authMiddleware, placeOrder);

// Verify payment
orderRouter.post("/verify", verifyOrder);

// User orders
orderRouter.post("/userOrders", authMiddleware, userOrders);

// Admin: list all orders
orderRouter.get("/list", listOrders);

// Update order status
orderRouter.post("/status", updateStatus);

export default orderRouter;
