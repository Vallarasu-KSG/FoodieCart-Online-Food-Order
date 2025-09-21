// routes/ContactRoute.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Define Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Create Model
const Contact = mongoose.model("Contact", contactSchema);

// POST: Save Contact Form Data
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ message: "Message received. Thank you!" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
});

export default router;
