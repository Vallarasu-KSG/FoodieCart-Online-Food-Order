import React from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Navbar/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './Pages/Add/Add'
import List from './Pages/List/List'
import Orders from './Pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import Home from './Pages/Home/Home'
const App2 = () => {

  // const url = "http://localhost:4001";

  return (
  <>
      <div className='app'>
      <ToastContainer/>
      <Navbar />
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/add' element={<Add />}/>
          <Route path='/list' element={<List />}/>
          <Route path='/Orders' element={<Orders />}/>
        </Routes>
      </div>
    </div>
  </>
  )
}

export default App2;