import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image, stock }) => {
    const { cartItems, addToCart, url } = useContext(StoreContext);

    const isAddedToCart = cartItems[id] !== undefined; // Check if item is already added

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />

                {/* Show "Out of Stock" if stock is 0 */}
                {stock === 0 ? (
                    <button className="out-of-stock-btn" disabled>Out of Stock</button>
                ) : isAddedToCart ? (
                    <button className="added-to-cart-btn" disabled>Added to Cart</button>
                ) : (
                    <img 
                        className='add' 
                        onClick={() => addToCart(id)}  
                        src={assets.add_icon_white} 
                        alt="Add to cart" 
                    />
                )}
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating stars" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">₹ {price}</p>

                {/* Show Available Stock */}
                <p className={stock === 0 ? "out-of-stock-text" : "in-stock-text"}>
                    {stock === 0 ? "Out of Stock" : `Available: ${stock}`}
                </p>
            </div>
        </div>
    );
};

export default FoodItem;
