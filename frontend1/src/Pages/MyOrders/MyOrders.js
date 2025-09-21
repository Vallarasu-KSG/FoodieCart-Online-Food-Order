import React, { useContext, useEffect, useState, useCallback } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import parcel from '../../assets/Logo/Parcel.png';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = useCallback(async () => {
        const response = await axios.post(`${url}/api/order/userOrders`, {}, { headers: { token } });
        setData(response.data.data);
        console.log(response.data.data);
    }, [url, token]);

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token, fetchOrders]);

    return (
<div className="my-orders">
    <h1>My Orders</h1>
    <div className="table-wrapper">
        <table className="orders-table">
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Item Count</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((order, index) => (
                    <tr key={index}>
                        <td>
                            <img src={parcel} alt="Parcel" className="order-img" />
                        </td>
                        <td>
                            {order.items.map((item, idx) => (
                                idx === order.items.length - 1
                                    ? `${item.name} x ${item.quantity}`
                                    : `${item.name} x ${item.quantity},`
                            ))}
                        </td>
                        <td>₹{order.amount}.00</td>
                        <td>{order.items.length}</td>
                        {/* <span>&#x25cf;</span> */}
                        <td><b className='status'>{order.status}</b></td>
                        <td>
                            <button className="track-btn">Track Order</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

    );
};

export default MyOrders;
