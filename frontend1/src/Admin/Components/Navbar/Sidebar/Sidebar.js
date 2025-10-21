import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../../Context/StoreContext';
import { FaHome, FaPlus, FaList, FaShoppingBag, FaPhone, FaSignOutAlt } from "react-icons/fa"; // react-icons import

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

        {!collapsed && <div className="sidebar-text">Welcome, Admin!</div>}

        <div className="admin-sidebar-options">

          <NavLink 
            to="/home1" 
            className="admin-sidebar-option" 
            data-label="Home"
            onClick={() => setIsOpen(false)}
          >
            <FaHome className="sidebar-icon" />
            {!collapsed && <p>Home</p>}
          </NavLink>

          <NavLink 
            to="/add" 
            className="admin-sidebar-option" 
            data-label="Add Items"
            onClick={() => setIsOpen(false)}
          >
            <FaPlus className="sidebar-icon" />
            {!collapsed && <p>Add Items</p>}
          </NavLink>

          <NavLink 
            to="/list" 
            className="admin-sidebar-option" 
            data-label="List Items"
            onClick={() => setIsOpen(false)}
          >
            <FaList className="sidebar-icon" />
            {!collapsed && <p>List Items</p>}
          </NavLink>

          <NavLink 
            to="/orders" 
            className="admin-sidebar-option" 
            data-label="Orders"
            onClick={() => setIsOpen(false)}
          >
            <FaShoppingBag className="sidebar-icon" />
            {!collapsed && <p>Orders</p>}
          </NavLink>

          <NavLink 
            to="/admincontact" 
            className="admin-sidebar-option" 
            data-label="Contact"
            onClick={() => setIsOpen(false)}
          >
            <FaPhone className="sidebar-icon" />
            {!collapsed && <p>Contact</p>}
          </NavLink>
        </div>

        <div className="logout-btn-container">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-icon" />
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
