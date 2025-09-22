import React, { useContext, useEffect, useState, useCallback } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import parcel from '../../assets/Logo/Parcel.png';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Extract userId from JWT
    const extractUserIdFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || payload.userId || "";
        } catch {
            return "";
        }
    };

    const fetchOrders = useCallback(async () => {
        if (!token) {
            setError("You must be logged in to see orders.");
            return;
        }

        setLoading(true);
        try {
            const userId = extractUserIdFromToken(token);
            if (!userId) {
                setError("Invalid token. Please login again.");
                setLoading(false);
                return;
            }

            // POST request with userId in body (backend expects POST)
            const response = await axios.post(
                `${url}/api/order/userOrders`,
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setOrders(response.data.data);
                setError('');
            } else {
                setError(response.data.message || "Failed to fetch orders.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch orders. Please login again.");
        } finally {
            setLoading(false);
        }
    }, [url, token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="my-orders">
            <h1>My Orders</h1>
            {loading && <p>Loading orders...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div className="table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Item Count</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <img src={parcel} alt="Parcel" className="order-img" />
                                        </td>
                                        <td>
                                            {order.items.map((item, idx) => {
                                                const productName = item.name || item.productName || item.id || "Unknown Item";
                                                return idx === order.items.length - 1
                                                    ? `${productName} x ${item.quantity}`
                                                    : `${productName} x ${item.quantity}, `;
                                            })}
                                        </td>
                                        <td>₹{order.amount}</td>
                                        <td>{order.items.length}</td>
                                        <td>{order.paymentMethod || "Not Provided"}</td>
                                        <td><b className='status'>{order.status || "Pending"}</b></td>
                                        <td>
                                            <button className="track-btn">Track Order</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
