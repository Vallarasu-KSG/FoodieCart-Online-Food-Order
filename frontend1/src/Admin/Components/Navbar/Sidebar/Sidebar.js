import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../../Context/StoreContext';
import LogoutIcon from '../../../assets/icon/Logout_icon.png';

function Sidebar({ collapsed }) {
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // toggle sidebar

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <div className="top-navbar">
        <div className="top-logo">
          <img src={assets.logo} alt="Logo" />
        </div>
        <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${isOpen ? "open" : ""}`}>
        {/* <div className="logo-img-container desktop-only">
          <img src={assets.logo} alt="Company Logo" />
        </div> */}

        {/* Extra text above options */}
        {!collapsed && <div className="sidebar-text">Welcome, Admin!</div>}

        <div className="admin-sidebar-options">

          <NavLink 
            to="/home1" 
            className="admin-sidebar-option" 
            data-label="Home"
            onClick={() => setIsOpen(false)}
          >
            <img src={assets.add_icon} alt="Home" />
            {!collapsed && <p>Home</p>}
          </NavLink>

          <NavLink 
            to="/add" 
            className="admin-sidebar-option" 
            data-label="Add Items"
            onClick={() => setIsOpen(false)}
          >
            <img src={assets.add_icon} alt="Add Items" />
            {!collapsed && <p>Add Items</p>}
          </NavLink>

          <NavLink 
            to="/list" 
            className="admin-sidebar-option" 
            data-label="List Items"
            onClick={() => setIsOpen(false)}
          >
            <img src={assets.list_icon} alt="List Items" />
            {!collapsed && <p>List Items</p>}
          </NavLink>

          <NavLink 
            to="/orders" 
            className="admin-sidebar-option" 
            data-label="Orders"
            onClick={() => setIsOpen(false)}
          >
            <img src={assets.order_details_icon} alt="Orders" />
            {!collapsed && <p>Orders</p>}
          </NavLink>
          <NavLink 
            to="/admincontact" 
            className="admin-sidebar-option" 
            data-label="admincontact"
            onClick={() => setIsOpen(false)}
          >
            <img src={assets.order_details_icon} alt="admincontact" />
            {!collapsed && <p>Contact</p>}
          </NavLink>
        </div>

        <div className="logout-btn-container">
          <button className="logout-btn" onClick={handleLogout}>
            <img src={LogoutIcon} alt="Logout Icon" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {isOpen && <div className="sidebar-overlay show" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}

export default Sidebar;
