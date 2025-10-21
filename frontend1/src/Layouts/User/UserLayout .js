// UserLayout.js
import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { Outlet } from 'react-router-dom'; // Allows nested routing

const UserLayout = ({ setShowLogin }) => {
  return (
    <div className="user-layout">
      <Navbar setShowLogin={setShowLogin} />
      <div className="content">
        <Outlet /> {/* This is where user routes will be rendered */}
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
