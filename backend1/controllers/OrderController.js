import mongoose from "mongoose";
import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  try {
    // Validate the incoming request
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: userId, items, amount, or address" 
      });
    }

    // Ensure items array is not empty
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Items array cannot be empty" 
      });
    }

    // Create a new order
    const newOrder = new OrderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    // Clearing the user's cart after placing the order
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });

    // Send a success response
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    // Improved error handling (including logging the error message)
    console.error("Error placing order:", error);

    // Send a failure response
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the order",
      error: error.message,
    });
  }
};

const verifyOrder = async (req, res) => {
  const {orderId, success} = req.body;
  try {
    if (success=="true") {
      await OrderModel.findByIdAndUpdate(orderId, {payment:true});
      res.json({success:true, message:"Paid"})
    }
    else {
      // await OrderModel.findByIdAndDelete(orderId);
      res.json({success:false, message:"Not Paid"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false, message:"Error"})
  }
};

// users orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({userId:req.body.userId});
    res.json({success:true, data:orders})
  } catch (error) {
    console.log(error)
    res.json({success:false, message:"Error"})
  }
}

// Listing orders for admin panel
const listOrdera = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json({success:true, data:orders})
  } catch (error) {
    console.log(error)
    res.json({success:false, message:"Error"});
  }
}

// api for updating order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate orderId and status
    if (!orderId || !status) {
      return res.json({ success: false, message: "orderId and status are required" });
    }

    // Check if the orderId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.json({ success: false, message: "Invalid orderId" });
    }

    // Update the order status
    const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating status" });
  }
};


export { placeOrder, verifyOrder, userOrders, listOrdera, updateStatus };