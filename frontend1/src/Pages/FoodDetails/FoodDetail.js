import React from 'react';
import './FoodDetail.css';
import { menu_list } from '../../assets/assets'; // Ensure the path to assets is correct

const FoodDetail = () => {
  return (
    <div className="App">
      <h1>Food Menu</h1>
      <div className="menu">
        {menu_list.map((item, index) => (
          <div key={index} className="menu-item">
            <img src={item.menu_image} alt={item.menu_name} />
            <h2>{item.menu_name}</h2>
            <p><strong>Ingredients:</strong> {item.menu_Ingredients}</p>
            <p><strong>Description:</strong> {item.menu_Description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodDetail;
