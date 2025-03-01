import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, commodities, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  // Handle Input Change
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Place Order Function
  const placeOrder = async (event) => {
    event.preventDefault();

    if (!commodities || commodities.length === 0) {
      console.error("Commodities data is missing or not loaded.");
      alert("Cart is empty. Add items before placing an order.");
      return;
    }

    if (!token) {
      alert("User not authenticated. Please log in.");
      navigate('/login');
      return;
    }

    // Ensure all form fields are filled
    for (let key in data) {
      if (!data[key].trim()) {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    let orderItems = commodities
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
      }));

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2, // Fixed delivery fee
    };

    console.log("Order Data:", orderData);

    try {
      let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });

      console.log("Response:", response.data);

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert(response.data.message || 'Error placing order. Please try again.');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert(error.response?.data?.message || 'Order placement failed. Check console for details.');
    }
  };

  // Redirect if no token or empty cart
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* Left Section - Delivery Information */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>

      {/* Right Section - Cart Totals */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹ {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>₹ {getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹ {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PURCHASE</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
