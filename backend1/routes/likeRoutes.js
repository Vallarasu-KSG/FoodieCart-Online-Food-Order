import express from "express";
import { toggleLike, getLikes } from "../controllers/likeController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/like", authMiddleware, toggleLike);
router.get("/likes/:itemId", authMiddleware, getLikes);

export default router;
