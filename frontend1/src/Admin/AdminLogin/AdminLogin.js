import React, { useContext, useState } from 'react';
import './AdminLogin.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { url, setToken } = useContext(StoreContext);

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    const newUrl = `${url}/api/admin/login`;

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        toast.success("Admin Login successful!");

        setTimeout(() => {
          navigate('/home1');
        }, 1500);
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error occurred during login", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2> Admin Login </h2>
        </div>

        <div className="login-popup-inputs">
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="admin@example.com"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Admin@123"
            required
          />
        </div>

        <button type="submit">Login</button>

        <Link to="/" className="user-login-link">Go to Customer Login</Link>
      </form>
    </div>
  );
};

export default AdminLogin;
