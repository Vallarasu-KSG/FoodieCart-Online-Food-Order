import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import Logo from "../Navbar/Navbar_Logo.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { AiOutlineUser, AiOutlineShoppingCart, AiOutlineLogout } from "react-icons/ai";

const Navbar = ({ setShowLogin = () => console.warn("setShowLogin is not provided") }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation(); // detect current path
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setDropdownOpen(false);
    navigate("/");
  };

  const handleMenuClick = (menuItem) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelectorAll(".hidden-section").forEach((section) => {
      section.classList.add("show-section");
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine active menu item based on current path
  const getActiveClass = (path) => {
    return location.pathname.toLowerCase() === path.toLowerCase() ? "active" : "";
  };

  return (
    <div className="navbar">
      <Link to="/Home" onClick={() => handleMenuClick("home")} className="logo-link">
        <img src={Logo} alt="Logo" className="logo" />
      </Link>

      <ul className="navbar-menu">
        <Link to="/Home" onClick={() => handleMenuClick("home")}>
          <li className={getActiveClass("/home")}>Home</li>
        </Link>
        <Link to="/FoodMenu" onClick={() => handleMenuClick("FoodMenu")}>
          <li className={getActiveClass("/foodmenu")}>Menu</li>
        </Link>
        <Link to="/About" onClick={() => handleMenuClick("About")}>
          <li className={getActiveClass("/about")}>About</li>
        </Link>
      </ul>

      <div className="navbar-right" ref={dropdownRef}>
        <Link to="/cart" className="cart-icon">
          <AiOutlineShoppingCart size={24} color="white" />
        </Link>

        {!token ? (
          <button className="signin-btn" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        ) : (
          <div className="navbar-profile" onClick={() => setDropdownOpen((prev) => !prev)}>
            <AiOutlineUser size={28} color="white" />
            <ul className={`nav-profile-dropdown ${dropdownOpen ? "show" : ""}`}>
              <li
                onClick={() => {
                  navigate("/MyOrders");
                  setDropdownOpen(false);
                }}
              >
                <AiOutlineShoppingCart size={20} /> Orders
              </li>
              <hr />
              <li onClick={logout}>
                <AiOutlineLogout size={20} /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
