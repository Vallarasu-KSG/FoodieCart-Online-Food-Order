// AdminLayout.js
import React from 'react';
import './AdminLayout.css';
import Sidebar from '../../Admin/Components/Navbar/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {

  return (
    <div className={`admin-content`}>
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar  />
      </div>

      {/* Main Content */}
      <div className="s">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
