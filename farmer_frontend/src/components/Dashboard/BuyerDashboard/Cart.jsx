import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p><b>Price:</b> ${item.price}</p>
              <p><b>Quantity:</b> {item.quantity}</p>
              <button onClick={() => removeFromCart(item._id)}>❌ Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
