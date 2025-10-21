import mongoose from "mongoose";
import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/UserModel.js";

// ================= Place Order =================
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod, paymentDetails } = req.body;

    if (!userId || !items || !amount || !address || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, items, amount, address, or paymentMethod",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array cannot be empty",
      });
    }

    const newOrder = new OrderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod,
      paymentDetails,
    });

    await newOrder.save();

    // Clear cart
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the order",
      error: error.message,
    });
  }
};

// ================= Verify Order =================
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await OrderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

// ================= User Orders =================
const userOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// ================= Admin: List Orders =================
const listOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error listing orders" });
  }
};

// ================= Update Order Status / Cancel =================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({ success: false, message: "orderId and status are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.json({ success: false, message: "Invalid orderId" });
    }

    if (status.toLowerCase() === "cancelled") {
      // Delete order completely
      const deletedOrder = await OrderModel.findByIdAndDelete(orderId);
      if (!deletedOrder) return res.json({ success: false, message: "Order not found" });
      return res.json({ success: true, message: "Order cancelled and removed" });
    }

    // Update status normally
    const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) return res.json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
