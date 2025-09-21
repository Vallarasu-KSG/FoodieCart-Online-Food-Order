import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../../Context/StoreContext'
import Logout from '../../assets/icon/Logout_icon.png'


const Navbar = ({ setShowLogin }) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () => {
      localStorage.removeItem("token");
      setToken("");
      navigate('/');
      // setMenuOpen(false);
  };


  return (
    <div className='admin-navbar'>
      <NavLink to={'/home1'} ><img className='nav-img-1' src={assets.logo} alt="" /> <p>Admin</p></NavLink>
      {/* <img className='nav-img-2' src={assets.profile_icon} alt="" /> */}
        {!token ? (
            <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
            <div className="navbar-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={assets.profile_icon} alt="Profile" />
                {dropdownOpen && (
                    <ul className="nav-profile-dropdown">
                        <li onClick={logout}>
                            <img src={Logout} alt="Logout" /> Logout
                        </li>
                    </ul>
                )}
            </div>
        )}
    </div>
  )
}

export default Navbar