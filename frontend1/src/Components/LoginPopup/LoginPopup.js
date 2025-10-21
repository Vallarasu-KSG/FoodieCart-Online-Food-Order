import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
    const newUrl = `${url}${endpoint}`;

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        toast.success(currState === "Login" ? "Login successful!" : "Registration successful!");

        setTimeout(() => {
          navigate('/Home');
        }, 1000);
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error occurred during the request", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
        </div>

        <div className="login-popup-inputs">
          {currState !== "Login" && (
            <>
              <input
                type="text"
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                placeholder="Enter Your Name"
                required
              />
              <input
                type="number"
                name="mobile"
                onChange={onChangeHandler}
                value={data.mobile}
                placeholder="Enter Your Number"
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Enter Your Email"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Enter Your Password"
            required
          />
        </div>

        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" id="terms" required />
          <label>I agree to the <span>Terms & Conditions</span></label>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new user account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}

        <Link to="/admin" className="admin-login-link">Go to Admin Login</Link>
      </form>
    </div>
  );
};

export default LoginPopup;
