import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, commodities, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Handle loading state
  if (!cartItems || !commodities) {
    return <h2>Loading cart...</h2>;
  }

  // Filter cart items to display only added ones
  const filteredItems = commodities.filter((item) => cartItems[item._id] > 0);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {/* Display cart items */}
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item._id}>
              <div className="cart-items-title cart-items-item">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
                <p>{item.name}</p>
                <p>Rs {item.price.toFixed(2)}</p>
                <p>{cartItems[item._id]}</p>
                <p>Rs {(item.price * cartItems[item._id]).toFixed(2)}</p>
                <p onClick={() => removeFromCart(item._id)} className="cross">x</p>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <h3 className="empty-cart">Your cart is empty.</h3>
        )}
      </div>

      {/* Cart Total Section */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs {getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs {getTotalCartAmount() > 0 ? "4500.00" : "0.00"}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs {getTotalCartAmount() > 0 ? (getTotalCartAmount() + 4500).toFixed(2) : "0.00"}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")} disabled={getTotalCartAmount() === 0}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* Promo Code Section */}
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here:</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
