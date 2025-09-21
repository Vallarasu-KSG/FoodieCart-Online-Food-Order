// AdminLayout.js
import React from 'react';
import './AdminLayout.css'
import Navbar from '../../Admin/Components/Navbar/Navbar';
import Sidebar from '../../Admin/Components/Navbar/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom'; // Allows nested routing

const AdminLayout = () => {
  return (
    <>
    <Navbar/>
        <div className="admin-content">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="s">
        <Outlet /> This is where admin routes will be rendered
      </div>
    </div>
    </>
  );
};

export default AdminLayout;
