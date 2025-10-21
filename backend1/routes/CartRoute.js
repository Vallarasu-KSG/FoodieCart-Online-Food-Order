import express from "express"
import authMiddleware from "../middleware/auth.js";
import { addToCart, removeFromCart, getCart } from "../controllers/CartController.js"

const CartRoute = express.Router();

CartRoute.post("/add", authMiddleware, addToCart)
CartRoute.post("/remove", authMiddleware, removeFromCart)
CartRoute.post("/get", authMiddleware, getCart)

export default CartRoute;