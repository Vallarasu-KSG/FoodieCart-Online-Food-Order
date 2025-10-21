import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Home.css';

const API_URL = "https://food-order-website-backend-final.onrender.com";

const OnlineFoodOrderAdminHome = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/order/list`);
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('An error occurred while fetching orders');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const newOrdersCount = orders.filter(order => order.status === 'Food Processing').length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

  return (
    <div className="admin-home">
      <main className="admin-main">

        {/* Stats Cards */}
        <section className="stats">
          <div className="stat-card">
            <h2>{newOrdersCount}</h2>
            <p>New Orders</p>
          </div>
          <div className="stat-card">
            <h2>{orders.length}</h2>
            <p>Total Orders</p>
          </div>
          <div className="stat-card">
            <h2>₹{totalRevenue}</h2>
            <p>Total Revenue</p>
          </div>
        </section>

        {/* Recent Orders Table */}
        <section className="recent-orders">
          <h2>Recent Orders</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map(order => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.address.firstName} {order.address.lastName}</td>
                      <td>₹{order.amount}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* <footer className="admin-footer">
        <p>&copy; 2025 Food Order Admin. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default OnlineFoodOrderAdminHome;
