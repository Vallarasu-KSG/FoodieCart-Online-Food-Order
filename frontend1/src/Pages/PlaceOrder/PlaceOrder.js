import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, token, setCardItem } = useContext(StoreContext);

  const {
    cartItem = [],
    subtotal = 0,
    discount = 0,
    deliveryFee = 0,
    tax = 0,
    totalAmount = 0,
  } = location.state || {};

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

  const [paymentMethod, setPaymentMethod] = useState("Cash"); // default
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [cashDetails, setCashDetails] = useState({
    billAmount: totalAmount,
    givenAmount: "",
    balance: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validateForm = () =>
    Object.values(formData).every((v) => v.trim() !== "");

  // Extract userId from JWT token
  const extractUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.userId || "";
    } catch {
      return "";
    }
  };

  // Calculate cash balance dynamically
  const handleCashChange = (e) => {
    const { name, value } = e.target;
    setCashDetails((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "givenAmount") {
        const given = parseFloat(value) || 0;
        updated.balance = given - totalAmount;
      }
      return updated;
    });
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!token) {
      alert("Please log in to place your order.");
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    if (cartItem.length === 0 || totalAmount === 0) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }

    // Prepare items array for backend
    const orderItems = cartItem.map((item) => ({
      id: item.id || item._id || item.productId,
      name: item.name || item.productName || "Unknown Item",
      quantity: item.quantity,
      price: item.offerPrice || item.price,
    }));

    const orderData = {
      userId: extractUserIdFromToken(token),
      items: orderItems,
      amount: totalAmount,
      address: formData,
      paymentMethod,
      paymentDetails:
        paymentMethod === "UPI"
          ? { upiId }
          : paymentMethod === "Card"
          ? cardDetails
          : cashDetails,
    };

    console.log("Sending Order Data:", orderData);

    try {
      setIsLoading(true);
      setError("");

      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        alert("Order placed successfully!");
        setCardItem([]);
        navigate("/MyOrders");
      } else {
        setError(
          response.data?.message || "Failed to place order. Please try again."
        );
      }
    } catch (err) {
      console.error("Place order error:", err.response?.data || err.message);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || totalAmount === 0) {
      navigate("/cart");
    }
  }, [token, totalAmount, navigate]);

  return (
    <form className="placeOrder" onSubmit={handleConfirmOrder}>
      <div className="place-Order-Left">
        <p className="title">Delivery Information</p>
        {[
          "firstName",
          "lastName",
          "email",
          "contact",
          "building",
          "street",
          "city",
          "state",
          "pinCode",
          "country",
        ].map((field) => (
          <input
            key={field}
            type={
              field === "email"
                ? "email"
                : field === "contact" || field === "pinCode"
                ? "tel"
                : "text"
            }
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleInputChange}
          />
        ))}
      </div>

      <div className="place-Order-Right">
        <h1>Order Summary</h1>
        <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
        <p>Discount: - ₹ {discount.toFixed(2)}</p>
        <p>Delivery Fee: ₹ {deliveryFee.toFixed(2)}</p>
        <p>Tax: ₹ {tax.toFixed(2)}</p>
        <p className="total">Total Pay: ₹ {totalAmount.toFixed(2)}</p>

        {/* Payment Options */}
        <div className="payment-container">
          <h3>Choose Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Cash"
                checked={paymentMethod === "Cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card
            </label>
          </div>

          {/* Cash Section */}
          {paymentMethod === "Cash" && (
            <div className="cash-section">
              <input
                type="number"
                name="billAmount"
                value={cashDetails.billAmount}
                readOnly
              />
              <input
                type="number"
                name="givenAmount"
                placeholder="Given Amount"
                value={cashDetails.givenAmount}
                onChange={handleCashChange}
              />
              <input
                type="number"
                name="balance"
                placeholder="Balance"
                value={cashDetails.balance}
                readOnly
              />
            </div>
          )}

          {/* UPI Section */}
          {paymentMethod === "UPI" && (
            <div className="upi-section">
              <input
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          {/* Card Section */}
          {paymentMethod === "Card" && (
            <div className="card-section">
              <input
                type="text"
                placeholder="Card Number"
                maxLength="16"
                value={cardDetails.cardNumber}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, expiry: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="CVV"
                maxLength="3"
                value={cardDetails.cvv}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cvv: e.target.value })
                }
              />
            </div>
          )}
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
