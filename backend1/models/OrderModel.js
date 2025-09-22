import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: { type: Array, required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },

  // ✅ New fields
  paymentMethod: {
    type: String,
    enum: ["Cash", "UPI", "Card"], // restrict to these values
    required: true,
  },
  paymentDetails: {
    type: Object, // flexible object (cash balance, upiId, card last4, etc.)
    default: {},
  },
});

const OrderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default OrderModel;
