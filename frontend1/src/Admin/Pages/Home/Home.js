import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';  // Add this import at the top
import './Home.css';

const OnlineFoodOrderAdminHome = () => {
        // const url = "http://localhost:4001";
    const url = "https://food-order-website-backend-final.onrender.com";
    const [orders, setOrders] = useState([]); // Initialize state for orders

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                setOrders(response.data.data); // Set orders data into state
                console.log(response.data.data);
            } else {
                toast.error('Error fetching orders');
            }
        } catch (error) {
            toast.error('An error occurred while fetching orders');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchAllOrders(); // Fetch orders when component mounts
    }, []);

    return (
        <div className="admin-home">
            <main className="admin-main">
                <section className="stats">
                    <div className="stat-card">
                        <h2>{orders.filter(order => order.status === 'Food Processing').length}</h2>
                        <p>New Orders</p>
                    </div>
                    <div className="stat-card">
                        <h2>{orders.length}</h2>
                        <p>Total Orders</p>
                    </div>
                    <div className="stat-card">
                        <h2>₹{orders.reduce((acc, order) => acc + order.amount, 0)}</h2>
                        <p>Total Revenue</p>
                    </div>
                </section>

                <section className="recent-orders">
                    <h2>Recent Orders</h2>
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
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date in descending order
  .slice(0, 100) // Get the top 3 most recent orders
  .reverse() // Reverse the order to show oldest first within the top 3
  .map((order) => (
    <tr key={order._id}>
      <td>{order._id}</td>
      <td>{order.address.firstName} {order.address.lastName}</td>
      <td>₹{order.amount}</td>
      <td>{order.status}</td>
    </tr>
  ))}


                        </tbody>
                    </table>
                </section>
            </main>

            <footer className="admin-footer">
                <p>&copy; 2025 Food Order Admin. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default OnlineFoodOrderAdminHome;
