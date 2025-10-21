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
  const [popupOrder, setPopupOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);

  const extractUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId || "";
    } catch {
      return "";
    }
  };

  const fetchOrders = useCallback(async () => {
    if (!token) return setError("You must be logged in to see orders.");

    setLoading(true);
    try {
      const userId = extractUserIdFromToken(token);
      if (!userId) return setError("Invalid token. Please login again.");

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

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancelConfirm = async (orderId) => {
    try {
      const response = await axios.post(
        `${url}/api/order/status`,
        { orderId, status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
        setCancelOrder(null);
      } else {
        alert(response.data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling order.");
    }
  };

  return (
    <div className="placeOrder-myorders">
      <h1 className="placeOrder-title">My Orders</h1>
      {loading && <p className="placeOrder-loading">Loading orders...</p>}
      {error && <p className="placeOrder-error">{error}</p>}

      {!loading && !error && (
        <div className="placeOrder-table-wrapper">
          <table className="placeOrder-orders-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Order</th>
                <th>Items</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="placeOrder-empty">No orders found.</td>
                </tr>
              ) : orders.map((order, idx) => (
                <tr key={order._id}>
                  <td data-label="S.No">{idx + 1}</td>
                  <td data-label="Order">
                    <img src={parcel} alt="Parcel" className="placeOrder-order-img" />
                  </td>
                  <td data-label="Items">
                    {order.items.map((item, i) => {
                      const name = item.name || item.productName || item.id || "Unknown Item";
                      return i === order.items.length - 1
                        ? `${name} x ${item.quantity}`
                        : `${name} x ${item.quantity}, `;
                    })}
                  </td>
                  <td data-label="Item">{order.items.length}</td>
                  <td data-label="Amount">₹{order.amount}</td>
                  <td data-label="Payment">{order.paymentMethod || "Not Provided"}</td>
                  <td data-label="Status"><b className='placeOrder-status'>{order.status || "Pending"}</b></td>
                  <td data-label="Actions">
                    <div className="placeOrder-action-btns">
                      <button className="placeOrder-track-btn" onClick={() => setPopupOrder(order)}>Track</button>
                      <button className="placeOrder-cancel-btn" onClick={() => setCancelOrder(order)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Track popup */}
      {popupOrder && (
        <div className="placeOrder-popup-overlay" onClick={() => setPopupOrder(null)}>
          <div className="placeOrder-popup-content" onClick={e => e.stopPropagation()}>
            <h3>Order Status</h3>
            <p><span className="placeOrder-popup-label">Order ID:</span> {popupOrder._id}</p>
            <p><span className="placeOrder-popup-label">Status:</span> {popupOrder.status}</p>
            <button className="placeOrder-close-btn" onClick={() => setPopupOrder(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Cancel confirm popup */}
      {cancelOrder && (
        <div className="placeOrder-popup-overlay" onClick={() => setCancelOrder(null)}>
          <div className="placeOrder-popup-content" onClick={e => e.stopPropagation()}>
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel order <b>{cancelOrder._id}</b>?</p>
            <div className="placeOrder-popup-actions">
              <button className="placeOrder-cancel-btn" onClick={() => handleCancelConfirm(cancelOrder._id)}>Yes, Cancel</button>
              <button className="placeOrder-track-btn" onClick={() => setCancelOrder(null)}>No, Go Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
