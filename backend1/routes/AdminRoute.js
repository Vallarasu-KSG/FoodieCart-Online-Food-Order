import express from "express";
import { loginUser } from "../controllers/AdminController.js";

const AdminRoute = express.Router();

// Only login route (register removed)
AdminRoute.post("/login", loginUser);

export default AdminRoute;