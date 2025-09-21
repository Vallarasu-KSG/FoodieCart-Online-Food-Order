import React, { useContext, useEffect, useState } from "react";
import './PlaceOrder.css';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const PlaceOrder = () => {
  const location = useLocation();
  const { url, token, setCardItem } = useContext(StoreContext); // Fetch token from context
  const { cartItem = [], subtotal = 0, discount = 0, deliveryFee = 0, tax = 0, totalAmount = 0 } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    building: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [upiDetails, setUpiDetails] = useState({ selectedUpiOption: "", upiId: "" });
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", cardholderName: "", expiryDate: "", cvv: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpiOptionChange = (e) => {
    setUpiDetails((prevDetails) => ({ ...prevDetails, selectedUpiOption: e.target.value }));
  };

  const handleUpiDetailChange = (e) => {
    const { name, value } = e.target;
    setUpiDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleCardDetailChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const validateForm = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleConfirmOrder = async (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
  });

  // Toggle class for showing sections
  const hiddenSections = document.querySelectorAll(".hidden-section");
  hiddenSections.forEach((section) => {
      section.classList.add("show-section"); // Make visible
  });

    if (!validateForm()) {  
      alert("Please fill out all required fields correctly.");
      return;
    }

    const orderItems = cartItem.map((item) => ({ ...item }));

    const paymentData =
      paymentMethod === "Cash"
        ? { method: "Cash" }
        : paymentMethod === "UPI"
        ? { method: "UPI", details: upiDetails }
        : { method: "Card", details: cardDetails };

    const orderData = {
      address: formData,
      items: orderItems,
      amount: totalAmount,
      payment: paymentData,
    };

    try {
      setIsLoading(true);

      const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });

      if (response.data?.success) {
        alert("Order placed successfully!");
        navigate("/MyOrders")
        setCardItem([ ])
      }      
    } catch (error) {
      alert("An error occurred while placing the order. Please try again later.");
      console.error("Request Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || totalAmount === 0) {
      navigate('/cart');
    }
  }, [token, totalAmount, navigate]);
  
  

  return (
    <form className="placeOrder">
      <div className="place-Order-Left">
        <p className="title">Delivery Information</p>
        {["firstName", "lastName", "email", "contact", "building", "street", "city", "state", "pinCode", "country"].map((field, index) => (
          <input
            key={index}
            type={field === "email" ? "email" : field === "contact" || field === "pinCode" ? "tel" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleInputChange}
          />
        ))}
      </div>
      <div className="place-Order-Right">
        <h1>Order Total</h1>
        <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
        <p>Discount: - ₹ {discount.toFixed(2)}</p>
        <p>Delivery Fee: ₹ {deliveryFee.toFixed(2)}</p>
        <p>Tax: ₹ {tax.toFixed(2)}</p>
        <p className="total">Total Pay: ₹ {totalAmount.toFixed(2)}</p>

        <div className="payment-method">
          <h2>Select Payment Method</h2>
          <div className="payment-option">
            {["Cash", "UPI", "Card"].map((method) => (
              <div key={method}>
                <label>
                  <input type="radio" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
                  {method}
                </label>
              </div>
            ))}
          </div>
        </div>

        {paymentMethod === "Cash" && (
          <div className="cash-details">
            <h3>Cash Payment</h3>
            <p>Please prepare the cash for the payment upon delivery.</p>
          </div>
        )}

        {paymentMethod === "UPI" && (
          <div className="upi-details">
            <h3>Select UPI Payment Method</h3>
            <select id="upi-options" value={upiDetails.selectedUpiOption} onChange={handleUpiOptionChange}>
              <option value="" disabled>
                -- Choose an option --
              </option>
              {["PhonePe", "Google Pay", "Paytm", "Bank Transfer"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="box">
              <input type="text" name="upiId" value={upiDetails.upiId} onChange={handleUpiDetailChange} placeholder="Enter UPI ID" />
            </div>
          </div>
        )}

        {paymentMethod === "Card" && (
          <div className="card-details">
            <h3>Enter Card Details</h3>
            {["Card Number", "Cardholder Name", "Expiry Date (MM/YY)", "CVV"].map((placeholder, index) => (
              <div key={index}>
                <label>{placeholder}</label>
                <input
                  type={placeholder === "CVV" ? "text" : "text"}
                  name={placeholder.split(" ")[0].toLowerCase()}
                  value={cardDetails[placeholder.split(" ")[0].toLowerCase()]}
                  onChange={handleCardDetailChange}
                  placeholder={placeholder}
                  maxLength={placeholder === "CVV" ? "3" : placeholder === "Card Number" ? "16" : undefined}
                />
              </div>
            ))}
          </div>
        )}

        <button onClick={handleConfirmOrder} disabled={isLoading}>
          {isLoading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
