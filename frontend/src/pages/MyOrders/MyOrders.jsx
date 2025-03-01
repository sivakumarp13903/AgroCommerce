import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            setData(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="orders-page">
            <h2 className="orders-title">My Orders</h2>
            <div className="orders-container">
                {data.map((order, index) => (
                    <div key={index} className="order-card">
                        <img src={assets.parcel_icon} alt="Parcel" className="order-icon" />
                        <p className="order-items">
                            {order.items.map((item, idx) => 
                                idx === order.items.length - 1 ? `${item.name} x ${item.quantity}` : `${item.name} x ${item.quantity}, `
                            )}
                        </p>
                        <p className="order-price">Rs: {order.amount}.00</p>
                        <p className="order-count">Items: {order.items.length}</p>
                        <p className="order-status">
                            <span className="status-indicator">&#x25cf;</span>
                            <b>{order.status}</b>
                        </p>
                        <button className="track-order-btn" onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
