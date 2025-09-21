import React from 'react'
import './Sidebar.css'
import { assets } from '../../../assets/assets'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='admin-sidebar'>
        <div className="admin-sidebar-options">
            <NavLink to={'/add'} className="admin-sidebar-option">
                <h6><img src={assets.add_icon} alt="" /></h6>
                <p>Add Items</p>
            </NavLink>
            <NavLink to={'/list'} className="admin-sidebar-option">
                <img src={assets.list_icon} alt="" />
                <p>List Items</p>
            </NavLink>
            <NavLink to={'./orders'} className="admin-sidebar-option">
                <img src={assets.order_details_icon} alt="" />
                <p>Orders</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar