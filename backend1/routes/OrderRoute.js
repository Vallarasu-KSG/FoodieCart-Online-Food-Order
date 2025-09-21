import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrdera, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/OrderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);  
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/userOrders", authMiddleware, userOrders)
orderRouter.get("/list", listOrdera)
orderRouter.post("/status", updateStatus)

export default orderRouter;