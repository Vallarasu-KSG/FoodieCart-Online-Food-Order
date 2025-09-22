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
  const [cancelOrder, setCancelOrder] = useState(null); // separate cancel popup

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
    <div className="my-orders">
      <h1>My Orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Order</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Item Count</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No orders found.</td>
                </tr>
              ) : orders.map((order, idx) => (
                <tr key={order._id}>
                  <td data-label="S.No">{idx + 1}</td>
                  <td data-label="Order">
                    <img src={parcel} alt="Parcel" className="order-img" />
                  </td>
                  <td data-label="Items">
                    {order.items.map((item, i) => {
                      const name = item.name || item.productName || item.id || "Unknown Item";
                      return i === order.items.length - 1
                        ? `${name} x ${item.quantity}`
                        : `${name} x ${item.quantity}, `;
                    })}
                  </td>
                  <td data-label="Amount">₹{order.amount}</td>
                  <td data-label="Item Count">{order.items.length}</td>
                  <td data-label="Payment">{order.paymentMethod || "Not Provided"}</td>
                  <td data-label="Status"><b className='status'>{order.status || "Pending"}</b></td>
                  <td data-label="Actions">
                    <div className="action-btns">
                      <button className="track-btn" onClick={() => setPopupOrder(order)}>Track</button>
                      <button className="cancel-btn" onClick={() => setCancelOrder(order)}>Cancel</button>
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
        <div className="popup-overlay" onClick={() => setPopupOrder(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <h3>Order Status</h3>
            <p><span className="popup-label">Order ID:</span> {popupOrder._id}</p>
            <p><span className="popup-label">Status:</span> {popupOrder.status}</p>
            <button onClick={() => setPopupOrder(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Cancel confirm popup */}
      {cancelOrder && (
        <div className="popup-overlay" onClick={() => setCancelOrder(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel order <b>{cancelOrder._id}</b>?</p>
            <div className="popup-actions">
              <button className="cancel-btn" onClick={() => handleCancelConfirm(cancelOrder._id)}>Yes, Cancel</button>
              <button className="track-btn" onClick={() => setCancelOrder(null)}>No, Go Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
