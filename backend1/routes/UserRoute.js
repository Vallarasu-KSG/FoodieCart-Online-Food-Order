import express from "express";
import { loginUser, registerUser } from "../controllers/UserController.js";

const UserRoute = express.Router()

UserRoute.post("/register",registerUser)
UserRoute.post("/login",loginUser)

export default UserRoute;