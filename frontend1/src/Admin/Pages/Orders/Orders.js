import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import parcelIcon from "../../assets/icon/Parcel.png";

const API_URL = "https://food-order-website-backend-final.onrender.com";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/order/list`);
      if (data.success) {
        setOrders(data.data);
        console.log(data.data);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('An error occurred while fetching orders');
      console.error('Error:', error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/order/status`, { orderId, status });
      if (data.success) {
        fetchAllOrders(); // Refresh orders after update
      }
    } catch (error) {
      toast.error('An error occurred while updating status');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <img src={parcelIcon} alt="Parcel" className="order-icon" />
              <div className="order-details">
                <p className="order-items">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item.name} x {item.quantity}
                      {index < order.items.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                <div className="customer-info">
                  <p className="customer-name">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="customer-address">{order.address.street}</p>
                  <p className="customer-address">
                    {order.address.city}, {order.address.state}, {order.address.country} - {order.address.pinCode}
                  </p>
                  <p className="customer-contact">{order.address.contact}</p>
                </div>
                <p className="order-summary">
                  Items: {order.items.length} | Total: ₹{order.amount}
                </p>
                <select
                  className="status-dropdown"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out of Delivery">Out of Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
