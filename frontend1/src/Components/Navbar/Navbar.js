import React, { useContext, useState } from 'react';
import './Navbar.css';
import Logo from '../Navbar/Navbar_Logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import Profile from '../../assets/Logo/Profile.png';
import Bag from '../../assets/Logo/Bag_icon.png';
import Logout from '../../assets/Logo/Logout_icon.png';

const Navbar = ({ setShowLogin }) => {
    const [Menu, setMenu] = useState("home");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate('/');
    };

    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
        window.scrollTo({ top: 0, behavior: "smooth" });

        document.querySelectorAll(".hidden-section").forEach((section) => {
            section.classList.add("show-section");
        });
    };

    return (
        <div className="navbar">
            <Link to="/Home" onClick={() => handleMenuClick("home")} className="akhfjhf">
                <img src={Logo} alt="Logo" className="logo" />
            </Link>
            
            <ul className="navbar-menu">
                <Link to="/Home" onClick={() => handleMenuClick("home")}>
                    <li className={Menu === "home" ? "active" : ""}>Home</li>
                </Link>
                <Link to="/FoodMenu" onClick={() => handleMenuClick("FoodMenu")}>
                    <li className={Menu === "FoodMenu" ? "active" : ""}>Menu</li>
                </Link>
                <Link to="/About" onClick={() => handleMenuClick("About")}>
                    <li className={Menu === "About" ? "active" : ""}>About</li>
                </Link>
            </ul>

            <div className="navbar-right">
                <Link to="/cart" className="cart-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="white">
                        <path d="M221-120q-27 0-48-16.5T144-179L42-549q-5-19 6.5-35T80-600h190l176-262q5-8 14-13t19-5q10 0 19 5t14 13l176 262h192q20 0 31.5 16t6.5 35L816-179q-8 26-29 42.5T739-120H221Zm-1-80h520l88-320H132l88 320Zm260-80q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM367-600h225L479-768 367-600Zm113 240Z" />
                    </svg>
                </Link>

                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
                    <div className="navbar-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <img src={Profile} alt="Profile" />
                        {dropdownOpen && (
                            <ul className="nav-profile-dropdown">
                                <li onClick={() => navigate('/MyOrders')}>
                                    <img src={Bag} alt="Bag" /> Orders
                                </li>
                                <hr />
                                <li onClick={logout}>
                                    <img src={Logout} alt="Logout" /> Logout
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

Navbar.defaultProps = {
    setShowLogin: () => console.warn('setShowLogin is not provided'),
};

export default Navbar;
