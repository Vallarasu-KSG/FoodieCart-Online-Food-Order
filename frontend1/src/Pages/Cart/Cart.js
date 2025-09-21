import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import DiscountSticker from "../Payment/DiscountSticker" // Import the DiscountSticker component

const Cart = () => {
  const { cardItem, food_list, removeFromCard, getTotalCartAmount } = useContext(StoreContext);

  const navigate = useNavigate();
  const deliveryFee = 2;
  const tax = 0; // Future tax logic placeholder
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [error, setError] = useState("");
  // const url = "http://localhost:4001";
  const url = "https://food-order-website-backend-final.onrender.com";

  const promoCodes = {
    SAVE10: 10, // 10% discount
    WELCOME20: 20, // 20% discount
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

  const subtotal = getTotalCartAmount() || 0;
  const discount = appliedPromo ? (subtotal * promoCodes[appliedPromo]) / 100 : 0;
  const totalAmount = subtotal + deliveryFee + tax - discount;

  const handleCheckout = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
  });

  // Toggle class for showing sections
  const hiddenSections = document.querySelectorAll(".hidden-section");
  hiddenSections.forEach((section) => {
      section.classList.add("show-section"); // Make visible
  });

    const cartItems = food_list
      .filter((item) => cardItem[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cardItem[item._id],
      }));

    navigate('/placeOrder', {
      state: { cartItem: cartItems, subtotal, discount, deliveryFee, tax, totalAmount },
    });
  };

  return (
    <div className="cart">
      <p className="title">Cart Items : </p>
      <table className="cart-items">
        <thead>
          <tr className="cart-item-title">
            <th>Items</th>
            <th>Title</th>
            <th>Price</th>
            <th>Offer Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {food_list.filter((item) => cardItem[item._id] > 0).map((item) => (
            <tr className="cart-item-title cart-items-item" key={item._id}>
              <td><img src={`${url}/images/${item.image}`} alt={item.name} /></td>
              <td>{item.name}</td>
              <td>₹ {item.price}</td>
              <td>₹ {item.offerPrice}</td>
              <td>{cardItem[item._id]}</td>
              <td>₹ {item.offerPrice * cardItem[item._id]}</td>
              <td onClick={() => removeFromCard(item._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="undefined">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-bottom">
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here:</p>
          <div className="cart-promocode-input">
            <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter promo code" />
            <button onClick={handleApplyPromo}>Submit</button>
            <button onClick={handleRemovePromo}>Delete</button>
          </div>
          {appliedPromo && (
            <p style={{ color: "green" }}>
              Promo code "{appliedPromo}" applied! You get a {promoCodes[appliedPromo]}% discount.
            </p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="promo-code-sti">
            <DiscountSticker code="SAVE10" discount={10} />
            <DiscountSticker code="WELCOME20" discount={20} />
          </div>
        </div>
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
            <p>Delivery Fee: ₹ {deliveryFee}</p>
            <p>Tax: ₹ {tax}</p>
            <p>Discount: - ₹ {discount.toFixed(2)}</p>
            <p>Total: ₹ {totalAmount.toFixed(2)}</p>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
