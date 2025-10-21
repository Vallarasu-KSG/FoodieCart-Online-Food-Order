import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cardItem, food_list, removeFromCard, getTotalCartAmount } = useContext(StoreContext);

  const url = "https://food-order-website-backend-final.onrender.com";
  const navigate = useNavigate();
  const deliveryFee = 2;
  const tax = 0; // Future tax logic placeholder

  const subtotal = getTotalCartAmount() || 0;
  const totalAmount = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const cartItems = food_list
      .filter((item) => cardItem[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cardItem[item._id],
      }));

    navigate('/placeOrder', {
      state: { cartItem: cartItems, subtotal, discount: 0, deliveryFee, tax, totalAmount },
    });
  };

  return (
    <div className="cart">
      <p className="title">Cart Items:</p>

      <table className="cart-items">
        <thead>
          <tr className="cart-item-title">
            <th>Items</th>
            <th>Title</th>
            <th>Price</th>
            <th>Offer Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {food_list.filter((item) => cardItem[item._id] > 0).map((item) => (
            <tr className="cart-items-item" key={item._id}>
              <td><img src={`${url}/images/${item.image}`} alt={item.name} /></td>
              <td>{item.name}</td>
              <td><del>₹ {item.price}</del></td>
              <td>₹ {item.offerPrice}</td>
              <td>{cardItem[item._id]}</td>
              <td>₹ {item.offerPrice * cardItem[item._id]}</td>
              <td onClick={() => removeFromCard(item._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                  <path d="m256-200-56-56 224-224-224-224 56-56 
                    224 224 224-224 56 56-224 224 
                    224 224-56 56-224-224-224 224Z" />
                </svg>
              </td>
            </tr>
          ))}

          <tr className="cart-total-row">
            <td colSpan={4}></td>
            <td>Cart Total</td>
            <td>₹ {totalAmount.toFixed(2)}</td>
            <td><button onClick={handleCheckout}>Confirm</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Cart;
