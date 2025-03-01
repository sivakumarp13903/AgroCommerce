import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { commodities } = useContext(StoreContext); // Use 'commodities' instead of 'commodity_list'

  return (
    <div className="food-display" id="food-display">
      <h2>Find Your Commodity</h2>
      <div className="food-display-list">
        {commodities.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id} // Use '_id' as the key instead of 'index'
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                stock={item.stock}
              />
            );
          }
          return null; // Avoid undefined return in map()
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
