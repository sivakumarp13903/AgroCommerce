import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore Our Agro Products</h1>
      <p className='explore-menu-text'>
        Discover a wide range of fresh and organic agricultural products in our "Explore Menu" section. 
        Whether you're looking for farm-fresh vegetables, organic dairy products, high-quality grains, 
        or essential farming tools, we've got you covered. Our intuitive interface allows you to 
        filter and sort items by category, ensuring you find the best products quickly. 
        Shop with ease, knowing you're getting farm-to-table freshness every time!
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <div 
            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
            key={index} 
            className='explore-menu-list-item'
          >
            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreMenu;
