import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserLayout from './Layouts/User/UserLayout '; // User layout
import AdminLayout from './Layouts/Admin/AdminLayout '; // Admin layout


import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';
import FoodMenu from './Pages/FoodDetails/FoodDetail';
import VerifyOrder from './Pages/OrderNow/Verify';
import MyOrders from './Pages/MyOrders/MyOrders';
import About from './Pages/About/About';
import ContactPage from './Pages/ContactPage/ContactPage';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import BuyPage from './Pages/buy_page/buyPage';

import AdminLogin from './Admin/AdminLogin/AdminLogin'
import Home1 from './Admin/Pages/Home/Home'
import Add from './Admin/Pages/Add/Add';
import List from './Admin/Pages/List/List';
import Orders from './Admin/Pages/Orders/Orders';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import { ToastContainer } from 'react-toastify';
import Contact from './Admin/Pages/Contact/Contact';


function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        {/* Routing structure */}
        <Routes>
          {/* User Routes */}
          <Route element={<UserLayout setShowLogin={setShowLogin} />}>
            <Route path="/" element={<LoginPopup />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/placeOrder" element={<PlaceOrder />} />
            <Route path="/verify" element={<VerifyOrder />} />
            <Route path="/FoodMenu" element={<FoodMenu />} />
            <Route path="/MyOrders" element={<MyOrders />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<ContactPage />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/buyPage" element={<BuyPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/home1" element={<Home1 />}/>
            <Route path="/add" element={<Add />}/>
            <Route path="/list" element={<List />}/>
            <Route path="/orders" element={<Orders />}/>
            <Route path="/admincontact" element={<Contact/>}/>
          </Route>
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
