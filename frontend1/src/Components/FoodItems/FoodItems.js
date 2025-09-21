import React, { useState, useContext } from "react";
import "./FoodItems.css";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";

const FoodItems = ({ id, name, image, price, offerPrice, category, address, initialHot }) => {
  const { cardItem, addToCard, removeFromCard, setCardItem } = useContext(StoreContext);
  const [hotCount, setHotCount] = useState(initialHot || 0);
  const [liked, setLiked] = useState(false); // Track if heart is clicked
  const [loading, setLoading] = useState(false);
  const url = "https://food-order-website-backend-final.onrender.com";
  const Navigate = useNavigate();

  const handleBuyItem = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const hiddenSections = document.querySelectorAll(".hidden-section");
    hiddenSections.forEach((section) => section.classList.add("show-section"));
    setCardItem([]);
    addToCard(id);
    Navigate("/buyPage");
  };

  const handleHeartToggle = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setHotCount((prev) => prev + (newLiked ? 1 : -1));
    setLoading(true);

    try {
      const response = await fetch(`${url}/api/hotItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, Item: name, hotCount: hotCount + (newLiked ? 1 : -1) }),
      });
      if (!response.ok) throw new Error("Failed to submit hot click");
    } catch (error) {
      console.error("Error submitting hot click:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-items">
      <div className="food-item-image-container">
        <img
          className="food-item-image"
          src={`${url}/images/${image}`}
          alt={`Food_Name${name}`}
          height="180"
        />
        {!cardItem[id] ? (
          <AiOutlinePlus className="add1" onClick={() => addToCard(id)} size={22} />
        ) : (
          <div className="food-item-counter">
            <AiOutlineMinus className="remove-icon" onClick={() => removeFromCard(id)} size={22} />
            <p>{cardItem[id]}</p>
            <AiOutlinePlus className="add-icon" onClick={() => addToCard(id)} size={22} />
          </div>
        )}
      </div>

      <div className="food-item-info">
        {/* Name + Heart Counter */}
        <div className="food-name-heart">
          <p>{name}</p>
          <div className="heart-section" onClick={handleHeartToggle}>
            <AiFillHeart className={`heart-icon ${liked ? "liked" : ""}`} />
            <span className="heart-count">{hotCount}</span>
          </div>
        </div>

        <p className="food-item-price">
          <del>₹{price}</del> / ₹{offerPrice}
        </p>
        <p className="food-item-category">
          {category}, {address}
        </p>

        <button className="buy-btn" onClick={handleBuyItem}>
          <p>Buy Item</p>
        </button>
        {loading && <p>Submitting...</p>}
      </div>
    </div>
  );
};

export default FoodItems;
