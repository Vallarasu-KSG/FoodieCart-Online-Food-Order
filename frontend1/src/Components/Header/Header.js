import React from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate(); // Correctly initialize the useNavigate hook

  const goFoodView = () => {
      navigate('/FoodMenu'); // Use navigate to redirect to the FoodMenu route
  };

  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Your Favorite Dishes, Just a Click Away!</h2>
            <p>Discover a world of flavors with FoodieCart! From local favorites to international cuisines, we deliver fresh, delicious meals straight to your doorstep. Fast, easy, and convenient satisfy your cravings in just a click!</p>
            <button onClick={goFoodView} >View Me</button>
        </div>
    </div>
  )
}

export default Header