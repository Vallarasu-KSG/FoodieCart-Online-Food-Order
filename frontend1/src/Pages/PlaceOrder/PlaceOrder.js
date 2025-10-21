import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import DiscountSticker from "../Payment/DiscountSticker";

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

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [cashDetails, setCashDetails] = useState({
    billAmount: 0,
    givenAmount: "",
    balance: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [error, setError] = useState("");

  // ✅ Promo Codes
  const promoCodes = {
    SAVE10: 10,
    WELCOME20: 20,
  };

  const handleApplyPromo = () => {
    const promo = promoCode.toUpperCase();
    if (promoCodes[promo]) {
      setAppliedPromo(promo);
      setError("");
    } else {
      setAppliedPromo(null);
      setError("Invalid promo code. Please try again.");
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setAppliedPromo(null);
    setError("");
  };

  const discountAmount = appliedPromo
    ? (subtotal * promoCodes[appliedPromo]) / 100
    : discount;

  const finalTotal = subtotal + deliveryFee + tax - discountAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () =>
    Object.values(formData).every((v) => v.trim() !== "");

  const extractUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.userId || "";
    } catch {
      return "";
    }
  };

  const handleCashChange = (e) => {
    const { name, value } = e.target;
    setCashDetails((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "givenAmount") {
        const given = parseFloat(value) || 0;
        updated.balance = given - finalTotal;
      }
      return updated;
    });
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!token) {
      setPopup({
        visible: true,
        message: "Please log in to place your order.",
        type: "error",
      });
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      setPopup({
        visible: true,
        message: "Please fill all required fields.",
        type: "error",
      });
      return;
    }

    if (cartItem.length === 0 || finalTotal === 0) {
      setPopup({
        visible: true,
        message: "Your cart is empty.",
        type: "error",
      });
      navigate("/cart");
      return;
    }

    const orderItems = cartItem.map((item) => ({
      id: item.id || item._id || item.productId,
      name: item.name || item.productName || "Unknown Item",
      quantity: item.quantity,
      price: item.offerPrice || item.price,
    }));

    const orderData = {
      userId: extractUserIdFromToken(token),
      items: orderItems,
      amount: finalTotal,
      address: formData,
      paymentMethod,
      paymentDetails:
        paymentMethod === "UPI"
          ? { upiId }
          : paymentMethod === "Card"
          ? cardDetails
          : cashDetails,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setPopup({
          visible: true,
          message: "Order placed successfully!",
          type: "success",
        });
        setCardItem([]);
        setTimeout(() => {
          setPopup({ visible: false, message: "", type: "" });
          navigate("/MyOrders");
        }, 2500);
      } else {
        setPopup({
          visible: true,
          message: response.data?.message || "Failed to place order.",
          type: "error",
        });
      }
    } catch {
      setPopup({
        visible: true,
        message: "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Update billAmount when finalTotal changes
  useEffect(() => {
    setCashDetails((prev) => ({ ...prev, billAmount: finalTotal }));
  }, [finalTotal]);

  useEffect(() => {
    if (!token || finalTotal === 0) {
      navigate("/cart");
    }
  }, [token, finalTotal, navigate]);

  return (
    <>
      {popup.visible && (
        <div className={`popup-overlay ${popup.type}`}>
          <div className="popup-box">
            <p>{popup.message}</p>
            <button
              onClick={() =>
                setPopup({ visible: false, message: "", type: "" })
              }
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form className="placeOrder-container" onSubmit={handleConfirmOrder}>
        <div className="place-Order-Left-side">
          <div className="placeOrder-address-container">
            <div className="placeOrder-header-section">
              <p className="title">Delivery Information</p>
            </div>
            <div className="placeOrder-form-section">
              <div className="placeOrder-form-container">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="placeOrder-form-container">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
              </div>
              <div className="placeOrder-form-container">
                <input
                  type="text"
                  name="building"
                  placeholder="Building"
                  value={formData.building}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                />
                <input
                  type="tel"
                  name="pinCode"
                  placeholder="Pin Code"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="placeOrder-promocode">
            <p>If you have a promo code, enter it here:</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className={appliedPromo ? "applied" : ""}
              />
              <button type="button" onClick={handleApplyPromo}>
                Submit
              </button>
              <button type="button" onClick={handleRemovePromo}>
                Delete
              </button>
            </div>
            {appliedPromo && (
              <p className="promo-success">
                Promo code "{appliedPromo}" applied! You get{" "}
                {promoCodes[appliedPromo]}% discount.
              </p>
            )}
            {error && <p className="promo-error">{error}</p>}

            <div className="promo-code-sti">
              <DiscountSticker code="SAVE10" discount={10} />
              <DiscountSticker code="WELCOME20" discount={20} />
            </div>
          </div>
        </div>

        <div className="place-Order-Right-side">
          {/* Order Summary */}
          <div className="Summary-container">
            <h1>Order Summary</h1>
            <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
            <p>Discount: - ₹ {discountAmount.toFixed(2)}</p>
            <p>Delivery Fee: ₹ {deliveryFee.toFixed(2)}</p>
            <p>Tax: ₹ {tax.toFixed(2)}</p>
            <p className="total">Total Pay: ₹ {finalTotal.toFixed(2)}</p>
          </div>

          {/* Payment Options */}
          <div className="payment-container">
            <h3>Choose Payment Method</h3>
            <div className="payment-options">
              {["Cash", "UPI", "Card"].map((method) => (
                <label key={method}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {method}
                </label>
              ))}
            </div>

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

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
