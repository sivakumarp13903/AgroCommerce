import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className='header'>
      <div className='header-contents'>
        <h3>Buy Agriculture Commodities</h3>
        <p>
          Welcome to AgriMart, your trusted marketplace for organic agricultural commodities. 
          Whether you're looking for commodities, we connect you directly 
          with farmers and suppliers to ensure the best quality at competitive prices. 
          Start browsing now and support sustainable farming!
        </p>
        <button>Explore Products</button>
      </div>
    </div>
  );
};

export default Header;
