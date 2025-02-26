import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../../context/CartContext";
import "./BuyerDashboard.css";

const CommodityList = () => {
  const { addToCart } = useContext(CartContext);
  const [commodities, setCommodities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/products")
      .then((res) => setCommodities(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="commodity-container">
      <h2>🌾 Available Commodities</h2>
      <div className="commodity-list">
        {commodities.map((commodity) => (
          <div key={commodity._id} className="commodity-item">
            <img src={commodity.image} alt={commodity.name} />
            <h4>{commodity.name}</h4>
            <p>{commodity.description}</p>
            <p><b>Price:</b> ${commodity.price}</p>
            <button onClick={() => addToCart(commodity)}>🛒 Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommodityList;
