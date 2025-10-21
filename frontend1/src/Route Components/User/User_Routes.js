// Routes/UserRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../../Pages/Home/Home';
import Cart from '../../Pages/Cart/Cart';
import PlaceOrder from '../../Pages/PlaceOrder/PlaceOrder';
import FoodMenu from '../../Pages/FoodDetails/FoodDetail';
import VerifyOrder from '../../Pages/OrderNow/Verify';
import MyOrders from '../../Pages/MyOrders/MyOrders';
import About from '../../Pages/About/About';
import ContactPage from '../../Pages/ContactPage/ContactPage';
import PrivacyPolicy from '../../Pages/PrivacyPolicy/PrivacyPolicy';
import BuyPage from '../../Pages/buy_page/buyPage';
import LoginPopup from '../../Components/LoginPopup/LoginPopup';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LoginPopup />} />
      <Route path='/home' element={<Home />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/placeOrder' element={<PlaceOrder />} />
      <Route path='/verify' element={<VerifyOrder />} />
      <Route path='/FoodMenu' element={<FoodMenu />} />
      <Route path='/MyOrders' element={<MyOrders />} />
      <Route path='/About' element={<About />} />
      <Route path='/Contact' element={<ContactPage />} />
      <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
      <Route path='/buyPage' element={<BuyPage />} />
    </Routes>
  );
};

export default UserRoutes;
