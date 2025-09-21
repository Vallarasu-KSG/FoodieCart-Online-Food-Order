import express from "express";
import cors from "cors";
import { mongoDB } from "./config/db.js";
import foodRouter from "./routes/FoodRoute.js";
import UserRoute from "./routes/UserRoute.js";
import CartRoute from "./routes/CartRoute.js";
import orderRouter from "./routes/OrderRoute.js";
import contactRouter from "./routes/ContactRoute.js";
import 'dotenv/config';
import AdminRoute from "./routes/AdminRoute.js";
import likeRoute from "./routes/likeRoutes.js"

// 🔹 Import createAdmin
import { createAdmin } from "./controllers/AdminController.js";

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(cors());

// Basic route to check API status
app.get("/", (req, res) => {
  res.send("API is working ✅");
});

// MongoDB connection + create default admin
mongoDB().then(async () => {
  await createAdmin(); // ✅ run once when server starts
});

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", UserRoute);
app.use("/api/cart", CartRoute);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", AdminRoute);
app.use("/api", likeRoute); 

// Server connection
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
