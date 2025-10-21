// Routes/AdminRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../../Admin/AdminLogin/AdminLogin';
import Add from '../../Admin/Pages/Add/Add';
import List from '../../Admin/Pages/List/List';
import Orders from '../../Admin/Pages/Orders/Orders';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminLogin />} />
      <Route path='/admin/add' element={<Add />} />
      <Route path='/list' element={<List />} />
      <Route path='/orders' element={<Orders />} />
    </Routes>
  );
};

export default AdminRoutes;
